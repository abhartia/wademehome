"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("global_error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
          <h1>Something went wrong</h1>
          <p>We&apos;ve logged the error. Please refresh.</p>
          {error.digest ? <code>ref: {error.digest}</code> : null}
          <div style={{ marginTop: 16 }}>
            <button onClick={() => reset()}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
