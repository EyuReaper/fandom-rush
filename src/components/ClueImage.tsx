import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ClueImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ClueImage({ src, alt, className, style }: ClueImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-white/[0.03] border border-white/10 rounded-2xl ${className ?? ""}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-16 h-16 text-gray-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}