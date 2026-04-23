import { CSSProperties, ReactNode } from "react";

type Color = "lilas" | "green" | "gray" | "yellow";

interface BadgeProps {
  children: ReactNode;
  color?: Color;
  style?: CSSProperties;
}

const colorMap: Record<Color, CSSProperties> = {
  lilas: { color: "var(--lilas)", background: "var(--lilas-light)", border: "1px solid rgba(155,89,182,0.2)" },
  green: { color: "#15803d", background: "#f0fdf4", border: "1px solid #bbf7d0" },
  gray:  { color: "var(--muted)", background: "var(--bg2)", border: "1px solid var(--border)" },
  yellow: { color: "#92400e", background: "#fef3c7", border: "1px solid #fde68a" },
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
