import { useState } from "react";

interface IngredientImageProps {
  src?: string;
  emoji: string;
  alt: string;
  size?: number;
  rounded?: "full" | "lg";
  className?: string;
  emojiClassName?: string;
}

/**
 * Renders a real food image with rounded crop. Falls back to the original
 * emoji if no src is provided or the image fails to load.
 */
export function IngredientImage({
  src,
  emoji,
  alt,
  size = 56,
  rounded = "lg",
  className = "",
  emojiClassName = "",
}: IngredientImageProps) {
  const [failed, setFailed] = useState(false);
  const radius = rounded === "full" ? "rounded-full" : "rounded-lg";
  const style = { width: size, height: size };

  if (!src || failed) {
    return (
      <span
        aria-label={alt}
        role="img"
        style={style}
        className={`inline-flex items-center justify-center bg-muted/40 ${radius} ${className} ${emojiClassName}`}
      >
        <span style={{ fontSize: Math.round(size * 0.55) }}>{emoji}</span>
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      style={style}
      className={`object-cover bg-muted ${radius} ${className}`}
    />
  );
}