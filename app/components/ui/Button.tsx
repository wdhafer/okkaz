import { CSSProperties, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
  className?: string;
}

const base: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  fontFamily: "inherit",
  fontWeight: 500,
  borderRadius: 8,
  cursor: "pointer",
  transition: "background 0.15s, border-color 0.15s, opacity 0.15s",
  border: "none",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const variants: Record<Variant, CSSProperties> = {
  primary: { background: "var(--lilas)", color: "#fff", border: "1.5px solid var(--lilas)" },
  outline: { background: "#fff", color: "var(--ink)", border: "1.5px solid var(--line)" },
  ghost: { background: "transparent", color: "var(--muted)", border: "1.5px solid transparent" },
};

const sizes: Record<Size, CSSProperties> = {
  sm: { fontSize: 12, padding: "5px 12px" },
  md: { fontSize: 14, padding: "9px 18px" },
  lg: { fontSize: 15, padding: "12px 24px" },
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled,
  type = "button",
  style,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...base,
        ...variants[variant],
        ...sizes[size],
        ...(disabled ? { opacity: 0.5, cursor: "not-allowed" } : {}),
        ...style,
      }}
    >
      {children}
    </button>
  );
}
