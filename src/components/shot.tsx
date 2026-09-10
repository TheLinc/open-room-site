import Image, { type StaticImageData } from "next/image";

// A capture from the app, cut to the element it shows. Captured at 2x from
// the Windows build in its light theme; the frame gives a crop that ends in
// white something to end at.
export function Shot({
  src,
  alt,
  frame = true,
  className = "",
  sizes = "(min-width: 768px) 340px, calc(100vw - 48px)",
}: {
  src: StaticImageData;
  alt: string;
  frame?: boolean;
  className?: string;
  sizes?: string;
}) {
  const img = (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      className="block h-auto w-full"
      draggable={false}
    />
  );
  if (!frame) return <div className={className}>{img}</div>;
  return (
    <div
      className={`overflow-hidden rounded-panel border border-line bg-card p-2 ${className}`}
    >
      {img}
    </div>
  );
}
