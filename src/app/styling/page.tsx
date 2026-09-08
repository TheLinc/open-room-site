import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Gabarito,
  Instrument_Sans,
  Instrument_Serif,
  Onest,
  Schibsted_Grotesk,
  Sora,
} from "next/font/google";
import { StyleTile } from "@/components/style-tile";
import { referenceFindings, sharedPatterns, styleVariants } from "@/lib/style-variants";
import "./styling.css";

// Each candidate face is loaded once here and exposed as a CSS variable, so
// the tiles can point --st-display and --st-body at whichever they need.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const instrumentSans = Instrument_Sans({ variable: "--font-instrument-sans", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], axes: ["opsz"] });
const schibsted = Schibsted_Grotesk({ variable: "--font-schibsted", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const gabarito = Gabarito({ variable: "--font-gabarito", subsets: ["latin"] });
const onest = Onest({ variable: "--font-onest", subsets: ["latin"] });

const fontVars = [instrumentSerif, instrumentSans, bricolage, schibsted, sora, gabarito, onest]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "Styling · Open Room",
  description: "Five style foundations for the Open Room landing page.",
  robots: { index: false, follow: false },
};

export default function StylingPage() {
  return (
    <main className={`styling flex-1 ${fontVars}`}>
      <div className="styling-wrap">
        <section className="styling-intro">
          <p className="styling-kicker">Style tiles · 5 variants</p>
          <h1>A style foundation for the Open Room landing page.</h1>
          <p>
            Three reference sites were measured in the browser: fonts, sizes, weights, tracking, page and text colours,
            button radii. What they share is summarised below, then five complete systems follow. Each one is a full
            tile: palette, type scale, spacing, buttons and form fields, plus the hero re-set in that system.
          </p>
        </section>

        <p className="styling-kicker" style={{ marginBottom: 12 }}>
          What was measured
        </p>
        <div className="styling-refs">
          {referenceFindings.map((r) => (
            <article key={r.site} className="styling-ref">
              <div className="styling-ref-head">
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.site}
                </a>
                <div className="styling-ref-swatches" aria-hidden>
                  <span style={{ background: r.bg }} />
                  <span style={{ background: r.ink }} />
                  {r.accents.map((a) => (
                    <span key={a} style={{ background: a }} />
                  ))}
                </div>
              </div>
              <dl>
                <dt>Page</dt>
                <dd>
                  {r.bg} on {r.ink}
                </dd>
                <dt>Display</dt>
                <dd>{r.display}</dd>
                <dt>Body</dt>
                <dd>{r.body}</dd>
                <dt>H1</dt>
                <dd>{r.h1}</dd>
                <dt>Copy</dt>
                <dd>{r.body16}</dd>
                <dt>Button</dt>
                <dd>{r.button}</dd>
              </dl>
              <p>{r.takeaway}</p>
            </article>
          ))}
        </div>

        <p className="styling-kicker" style={{ marginBottom: 12 }}>
          What they share
        </p>
        <ol className="styling-patterns">
          {sharedPatterns.map((p) => (
            <li key={p}>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </div>

      <nav className="styling-nav" aria-label="Variants">
        <div className="styling-wrap">
          <ul>
            {styleVariants.map((v) => (
              <li key={v.id}>
                <a href={`#${v.id}`}>
                  <i style={{ background: v.colors.primary }} aria-hidden />
                  {String(v.index).padStart(2, "0")} {v.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {styleVariants.map((v) => (
        <StyleTile key={v.id} variant={v} />
      ))}
    </main>
  );
}
