import { defineConfig } from "@hey-api/openapi-ts";

const OPENAPI_INPUT =
  process.env.OPENAPI_INPUT ?? "http://127.0.0.1:8000/openapi.json";

export default defineConfig({
  input: OPENAPI_INPUT,
  output: "lib/api/generated",
  plugins: [
    {
      name: "@hey-api/client-fetch",
    },
    {
      name: "@tanstack/react-query",
    },
  ],
});
