import { CSSProperties, ReactNode } from "react";

type Color = "lilas" | "green" | "gray" | "yellow";

interface BadgeProps {
  children: ReactNode;
  color?: Color;
  style?: CSSProperties;
}

const colorMap: Record<Color, CSSProperties> = {
  lilas: { color: "var(--lilas)", background: "var(--lilas-soft)", border: "1px solid rgba(139,92,246,0.24)" },
  green: { color: "var(--lilas)", background: "var(--lilas-soft)", border: "1px solid rgba(139,92,246,0.24)" },
  gray:  { color: "var(--muted)", background: "#fff", border: "1px solid var(--line)" },
  yellow: { color: "var(--lilas)", background: "var(--lilas-soft)", border: "1px solid rgba(139,92,246,0.24)" },
};

export default function Badge({ children, color = "lilas", style }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",
        padding: "3px 10px",
        borderRadius: 20,
        ...colorMap[color],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
