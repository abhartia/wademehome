import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Global ignores — MUST be a config object with ONLY the `ignores` key.
  // ESLint flat config treats `ignores` as a global ignore only when the
  // object contains no other keys; mixing it with `rules`/`files`/etc.
  // silently downgrades it to a per-block ignore and lets the matched
  // paths get linted. Keep this block standalone.
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Hey API / openapi-ts output — uses `any` by design
      "lib/api/generated/**",
    ],
  },
  // Project-wide rule overrides.
  {
    rules: {
      // Honor the `_`-prefix convention for intentionally-unused args and
      // destructured values (e.g. placeholder params on exported function
      // signatures that must stay stable for callers).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;
