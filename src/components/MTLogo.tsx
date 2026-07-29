interface Props {
  className?: string;
  alt?: string;
  variant?: string;
  layout?: string;
  size?: string;
  showText?: boolean;
}

export default function MTLogo({
  className = "h-10 w-auto",
  alt = "MEGATRIX",
}: Props) {
  return (
    <img
      src="/logo-white.svg"
      alt={alt}
      className={`block object-contain ${className}`}
    />
  );
}