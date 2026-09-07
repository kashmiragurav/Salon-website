import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function SafeImage({ src, alt, className = "", ...props }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <div className={`${className} image-fallback`} role="img" aria-label={alt || "Image unavailable"}><ImageOff size={22} /></div>;
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} {...props} />;
}