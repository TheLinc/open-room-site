import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { LampFooter, LampHeader } from "@/components/lamp/lamp-chrome";
import { LampHero, type Flow } from "@/components/lamp/lamp-hero";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

// The Reading lamp page. Day is paper; night flips it so the page is near
// black and the copy sits on a beige card. The flow picks how what you say
// reaches the agents: word chips, or one continuous stream.
export function LampPage({
  night = false,
  flow = "chips",
}: {
  night?: boolean;
  flow?: Flow;
}) {
  return (
    <div
      className={`lamp ${night ? "is-night" : ""} ${instrumentSerif.variable} ${instrumentSans.variable}`}
    >
      <div className="lamp-wrap">
        <LampHeader />
      </div>
      <main className="lamp-wrap">
        <LampHero flow={flow} />
      </main>
      <div className="lamp-wrap">
        <LampFooter />
      </div>
    </div>
  );
}
