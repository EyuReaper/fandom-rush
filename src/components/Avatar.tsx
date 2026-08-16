import { useState } from "react";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
}

export default function Avatar({ src, name, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name ?? "avatar"}
        onError={() => setFailed(true)}
        className={`object-cover ${className ?? ""}`}
      />
    );
  }

  const initial = name?.charAt(0)?.toUpperCase();

  return (
    <div className={`flex items-center justify-center bg-white/5 text-gray-500 font-black ${className ?? ""}`}>
      {initial ? <span>{initial}</span> : <User className="w-1/2 h-1/2" />}
    </div>
  );
}