interface Props {
  className?: string;
  alt?: string;
  variant?: string;
  layout?: string;
  size?: string;
  showText?: boolean;
}

export default function MTLogo({
  className = "h-12 w-auto",
  alt = "MegaTrix",
}: Props) {
  return (
    <img
      src="/favicon.png"
      alt={alt}
      className={`block object-contain ${className}`}
    />
  );
}

