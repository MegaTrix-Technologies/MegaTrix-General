import { useState, useEffect } from "react";
import { ImageIcon } from "lucide-react";

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  thumbnailSize?: "sm" | "md" | "lg" | "full";
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * Automatically optimizes Unsplash and Cloudinary CDN URLs for fast thumbnail downloads
 */
export function getOptimizedImageUrl(
  url?: string | null,
  size: "sm" | "md" | "lg" | "full" = "md"
): string {
  if (!url) return "";

  const widthMap = {
    sm: 240,
    md: 520,
    lg: 800,
    full: 1400,
  };

  const qualityMap = {
    sm: 70,
    md: 78,
    lg: 82,
    full: 85,
  };

  const targetWidth = widthMap[size];
  const targetQuality = qualityMap[size];

  // Cloudinary Optimization
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const transform = `f_auto,q_auto,w_${targetWidth},c_limit`;
    if (!url.includes("/upload/" + transform)) {
      return url.replace("/upload/", `/upload/${transform}/`);
    }
    return url;
  }

  // Unsplash Optimization
  if (url.includes("unsplash.com")) {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set("w", targetWidth.toString());
      urlObj.searchParams.set("q", targetQuality.toString());
      urlObj.searchParams.set("auto", "format");
      urlObj.searchParams.set("fit", "crop");
      return urlObj.toString();
    } catch {
      return url.replace(/w=\d+/, `w=${targetWidth}`).replace(/q=\d+/, `q=${targetQuality}`);
    }
  }

  return url;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  thumbnailSize = "md",
  fetchPriority,
  loading = "lazy",
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  const optimizedSrc = getOptimizedImageUrl(src, thumbnailSize);

  useEffect(() => {
    setIsLoaded(false);
    setIsErrored(false);

    if (!optimizedSrc) return;

    // Check if the image is already cached in the browser
    const img = new Image();
    img.src = optimizedSrc;
    if (img.complete) {
      setIsLoaded(true);
    }
  }, [optimizedSrc]);

  if (!src || isErrored) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[var(--mt-bg-panel)] border border-[var(--mt-border)] text-[var(--mt-text-muted)] gap-2 select-none ${containerClassName || className}`}
      >
        <ImageIcon size={28} className="text-[var(--mt-blue)]/30" />
        <span className="font-mono text-[9px] tracking-widest uppercase">
          No Preview
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* SKELETON SHIMMER PLACEHOLDER */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--mt-bg-panel)] animate-pulse">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-[var(--mt-blue)]/5 to-transparent animate-shimmer" />
        </div>
      )}

      {/* OPTIMIZED IMAGE WITH SMOOTH FADE-IN */}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsErrored(true)}
        className={`transition-opacity duration-300 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
