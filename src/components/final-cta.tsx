import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";
import { copy } from "@/lib/copy";
import { restFrame } from "@/lib/room-frames";

export function FinalCta() {
  return (
    <section
      aria-labelledby="final-title"
      className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 lg:grid-cols-5 lg:gap-8"
    >
      <div className="flex flex-col gap-6 lg:col-span-3">
        <h2 id="final-title" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {copy.headline}
        </h2>
        <div className="max-w-xl">
          <WaitlistForm />
        </div>
      </div>
      <div className="room-fade lg:col-span-2">
        <Image
          src={restFrame}
          alt=""
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
