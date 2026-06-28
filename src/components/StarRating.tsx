import { useState } from "react";
import { Star } from "lucide-react";

const RATING_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#84cc16",
  5: "#22c55e",
};

interface StarRatingProps {
  value: number;
  variant: "row" | "badge";
  onChange?: (value: number) => void;
  size?: number;
}

export default function StarRating({ value, variant, onChange, size }: StarRatingProps) {
  const [hoveredStar, setHoveredStar] = useState(0);

  if (variant === "badge") {
    const rounded = Math.max(1, Math.min(5, Math.round(value)));
    const color = RATING_COLORS[rounded] || "#6b7280";
    const iconSize = size || 32;

    return (
      <div className="relative inline-flex items-center justify-center">
        <Star size={iconSize} fill={color} color={color} />
        <span
          className="absolute font-black text-white"
          style={{ fontSize: iconSize * 0.4 }}
        >
          {rounded}
        </span>
      </div>
    );
  }

  const displayValue = hoveredStar || value;
  const iconSize = size || 24;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="transition-transform hover:scale-110 active:scale-90 focus:outline-none"
          >
            <Star
              size={iconSize}
              fill={filled ? "#eab308" : "none"}
              color={filled ? "#eab308" : "#4b5563"}
            />
          </button>
        );
      })}
    </div>
  );
}
