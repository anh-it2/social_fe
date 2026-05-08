interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 20, color, className, style }: IconProps) {
  return (
    <span
      className={`material-symbols-rounded ${className ?? ""}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        color,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      {name}
    </span>
  );
}
