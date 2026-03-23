import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Wade Me Home rental search and renter tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "linear-gradient(145deg, #0f172a 0%, #111827 45%, #0b1220 100%)",
          color: "#f8fafc",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(145deg, #f59e0b 0%, #f97316 45%, #22d3ee 100%)",
              color: "#0b1220",
              fontSize: "30px",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            W
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Wade Me Home
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "980px",
          }}
        >
          <div
            style={{
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Rental search and renter tools from search through move-in.
          </div>
          <div
            style={{
              fontSize: "30px",
              color: "#cbd5e1",
              lineHeight: 1.3,
            }}
          >
            Map search, AI-assisted listings, tours, applications, and move-in
            support in one renter-first platform.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
