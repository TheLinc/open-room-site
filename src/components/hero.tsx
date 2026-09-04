import { HeroLoop } from "@/components/hero-loop";
import { WaitlistForm } from "@/components/waitlist-form";
import { copy } from "@/lib/copy";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:min-h-svh lg:py-24">
      <p className="sr-only">{copy.narration}</p>
      <HeroLoop>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {copy.headline}
        </h1>
        <p className="max-w-xl text-lg text-zinc-300">{copy.subheadline}</p>
        <div className="max-w-xl">
          <WaitlistForm />
        </div>
        <p className="text-xs text-zinc-500">{copy.trust}</p>
      </HeroLoop>
    </section>
  );
}
