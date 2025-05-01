import IconLogo from "/public/logo.svg";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Code Snippet";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom, #f9fafb, #ffffff)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 24,
            background: "white",
            color: "white",
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: 24,
          }}
        >
          <IconLogo width="64" height="64" />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: 24,
            color: "#111827",
          }}
        >
          Code Snippet
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#4B5563",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Create beautiful code screenshots for your presentations and social
          media. Easily customize, export, and share code images.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
