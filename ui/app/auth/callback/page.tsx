"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const API_BASE = process.env.NEXT_PUBLIC_CHAT_API_URL ?? "";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [message, setMessage] = useState("Signing you in...");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMessage("Missing magic-link token.");
      return;
    }
    (async () => {
      const response = await fetch(`${API_BASE}/auth/magic-link/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        setMessage("Magic link is invalid or expired.");
        return;
      }
      await refresh();
      router.replace("/app");
    })();
  }, [params, refresh, router]);

  return <div className="p-8 text-center">{message}</div>;
}
