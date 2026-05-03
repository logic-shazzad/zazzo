import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white"
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 9999,
            background: "#F5B800",
            color: "#111111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 900
          }}
        >
          Z
        </div>
      </div>
    ),
    size
  );
}
