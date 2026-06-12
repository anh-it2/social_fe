import { Avatar as AntAvatar } from "antd";
import { Icon } from "@/shared/components/Icon";
import { gradientStyle, initials } from "../lib/avatar";

interface AvatarProps {
  name: string;
  src?: string;
  seed?: string;
  size?: number;
  online?: boolean;
  ringColor?: string;
  group?: boolean;
}

export function Avatar({
  name,
  src,
  seed,
  size = 52,
  online = false,
  ringColor = "var(--color-bg)",
  group = false,
}: AvatarProps) {
  const seedKey = seed ?? name;
  const dotSize = Math.max(10, Math.round(size * 0.27));

  return (
    <div
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      <AntAvatar
        size={size}
        src={!group && src ? src : undefined}
        style={{
          ...(src && !group ? {} : gradientStyle(seedKey)),
          fontWeight: 700,
          fontSize: Math.round(size * 0.36),
        }}
      >
        {group ? (
          <Icon name="group" size={Math.round(size * 0.55)} color="#fff" />
        ) : (
          initials(name)
        )}
      </AntAvatar>
      {!group && online && (
        <span
          className="absolute rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            right: 0,
            bottom: 0,
            background: "#22c55e",
            boxShadow: `0 0 0 2px ${ringColor}`,
          }}
        />
      )}
    </div>
  );
}
