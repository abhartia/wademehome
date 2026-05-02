import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.unstubAllEnvs();
});

async function loadRules() {
  const mod = await import("@/lib/security/headers");
  return mod.securityHeaderRules();
}

function headerNames(rule: { headers: { key: string }[] }) {
  return rule.headers.map((h) => h.key.toLowerCase());
}

describe("securityHeaderRules", () => {
  it("emits the baseline headers on every path", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const rules = await loadRules();
    const everyPath = rules.find((r) => r.source === "/:path*");
    expect(everyPath).toBeDefined();
    const names = headerNames(everyPath!);
    expect(names).toContain("x-content-type-options");
    expect(names).toContain("referrer-policy");
    expect(names).toContain("permissions-policy");
    expect(names).toContain("cross-origin-opener-policy");
    expect(names).toContain("strict-transport-security");
    // CSP defaults to off (opt-in via env).
    expect(names).not.toContain("content-security-policy");
  });

  it("denies framing on non-embed routes only", async () => {
    const rules = await loadRules();
    const frameRule = rules.find((r) =>
      r.headers.some((h) => h.key.toLowerCase() === "x-frame-options"),
    );
    expect(frameRule).toBeDefined();
    expect(frameRule!.headers[0].value).toBe("DENY");
    // Source must exclude the embed paths so widget consumers can iframe them.
    expect(frameRule!.source).toContain("embed");
    expect(frameRule!.source).toMatch(/\?!/); // negative lookahead
  });

  it("omits HSTS in non-production by default", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("HSTS_ENABLED", "");
    const rules = await loadRules();
    const everyPath = rules.find((r) => r.source === "/:path*");
    expect(headerNames(everyPath!)).not.toContain(
      "strict-transport-security",
    );
  });

  it("emits CSP only when the env var is set", async () => {
    vi.stubEnv("CONTENT_SECURITY_POLICY", "default-src 'self'");
    const rules = await loadRules();
    const everyPath = rules.find((r) => r.source === "/:path*");
    const csp = everyPath!.headers.find(
      (h) => h.key.toLowerCase() === "content-security-policy",
    );
    expect(csp?.value).toBe("default-src 'self'");
  });

  it("permissions-policy locks down dangerous capabilities", async () => {
    const rules = await loadRules();
    const everyPath = rules.find((r) => r.source === "/:path*");
    const pp = everyPath!.headers.find(
      (h) => h.key.toLowerCase() === "permissions-policy",
    );
    expect(pp?.value).toContain("camera=()");
    expect(pp?.value).toContain("microphone=()");
    expect(pp?.value).toContain("payment=()");
  });
});
