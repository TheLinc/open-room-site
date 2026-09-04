import Image, { type StaticImageData } from "next/image";

export function BeatSection({
  id,
  title,
  body,
  alt,
  image,
  flip = false,
}: {
  id: string;
  title: string;
  body: string;
  alt: string;
  image: StaticImageData;
  flip?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:gap-12"
    >
      <div className={`flex flex-col gap-3 ${flip ? "lg:order-2" : ""}`}>
        <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <p className="max-w-md text-lg text-zinc-300">{body}</p>
      </div>
      <div className={`room-fade ${flip ? "lg:order-1" : ""}`}>
        <Image
          src={image}
          alt={alt}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
