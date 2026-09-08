import type { CSSProperties } from "react";
import { copy } from "@/lib/copy";
import { monoFont, type StyleVariant, type TypeStep } from "@/lib/style-variants";

const specimen: Record<TypeStep["name"], string> = {
  Display: "Talk to your agents",
  H1: copy.headline,
  H2: "Name your agents",
  H3: "Nothing leaves the room",
  Lead: "Give each Claude Code agent a name, a voice and its own folder.",
  Body: "Say hey and the name from wherever you are, and it comes back when it's done or stuck. A question is never dropped.",
  Small: "Free and open source. Uses the Claude Code login you already have.",
  Caption: "Open Room. A desktop app for Claude Code.",
};

const agents = [
  { name: "Juno", color: "teal", status: "working" },
  { name: "Atlas", color: "red", status: "done" },
  { name: "Vesper", color: "purple", status: "asking" },
] as const;

function tokens(v: StyleVariant): CSSProperties {
  const c = v.colors;
  const font = (f: { cssVar: string; fallback: string }) => `var(${f.cssVar}), ${f.fallback}`;
  const h1 = v.type.scale.find((s) => s.name === "H1")!;
  return {
    "--st-bg": c.bg,
    "--st-surface": c.surface,
    "--st-border": c.border,
    "--st-ink": c.ink,
    "--st-muted": c.muted,
    "--st-primary": c.primary,
    "--st-on-primary": c.onPrimary,
    "--st-secondary": c.secondary,
    "--st-on-secondary": c.onSecondary,
    "--st-accent": c.accent,
    "--st-error": c.tints.find((t) => /error/i.test(t.note ?? ""))?.hex ?? c.agents.red,
    "--st-teal": c.agents.teal,
    "--st-red": c.agents.red,
    "--st-purple": c.agents.purple,
    "--st-display": font(v.type.display),
    "--st-body": font(v.type.body),
    "--st-mono": font(monoFont),
    "--st-display-weight": String(v.type.scale[0].weight),
    "--st-h1-weight": String(h1.weight),
    "--st-h1-lh": String(h1.lineHeight),
    "--st-h1-tracking": h1.tracking,
    "--st-r-btn": `${v.radius.button}px`,
    "--st-r-input": `${v.radius.input}px`,
    "--st-r-card": `${v.radius.card}px`,
    "--st-ctl-h": `${v.controls.height}px`,
    "--st-ctl-fs": `${v.controls.fontSize}px`,
    "--st-ctl-fw": String(v.controls.fontWeight),
  } as CSSProperties;
}

function Swatch({
  name,
  hex,
  note,
  on,
  big = false,
}: {
  name: string;
  hex: string;
  note?: string;
  on?: string;
  big?: boolean;
}) {
  return (
    <div className={`st-swatch${big ? " is-big" : ""}`}>
      <i style={{ "--c": hex, "--on": on } as CSSProperties}>{on ? "Aa" : null}</i>
      <div>
        <b>{name}</b>
        <span>{hex.toUpperCase()}</span>
        {note ? <small> · {note}</small> : null}
      </div>
    </div>
  );
}

function Step({ step }: { step: TypeStep }) {
  const family =
    step.font === "display" ? "var(--st-display)" : step.font === "mono" ? "var(--st-mono)" : "var(--st-body)";
  return (
    <div className="st-step">
      <div className="st-step-meta">
        <b>{step.name}</b>
        {step.px}px / {step.lineHeight} / {step.weight}
        <br />
        {step.tracking === "0" ? "tracking 0" : `tracking ${step.tracking}`}
        {step.transform ? " / caps" : ""}
      </div>
      <p
        className="st-step-sample"
        style={{
          fontFamily: family,
          fontSize: step.px >= 40 ? `min(${step.px}px, 8vw)` : `${step.px}px`,
          lineHeight: step.lineHeight,
          fontWeight: step.weight,
          letterSpacing: step.tracking,
          textTransform: step.transform,
          fontStyle: step.italic ? "italic" : undefined,
        }}
      >
        {specimen[step.name]}
      </p>
    </div>
  );
}

export function StyleTile({ variant: v }: { variant: StyleVariant }) {
  const c = v.colors;
  const number = String(v.index).padStart(2, "0");
  return (
    <section id={v.id} className="st" style={tokens(v)} data-treatment={v.controls.treatment} aria-labelledby={`${v.id}-name`}>
      <div className="styling-wrap">
        <header className="st-head">
          <div>
            <p className="st-index">Variant {number}</p>
            <h2 id={`${v.id}-name`} className="st-name">
              {v.name}
            </h2>
            <p className="st-premise">{v.premise}</p>
            {v.heroLinks ? (
              <p className="st-hero-link st-row">
                {v.heroLinks.map((l) => (
                  <a key={l.href} className="st-btn is-secondary" href={l.href}>
                    {l.label}
                  </a>
                ))}
              </p>
            ) : null}
          </div>
          <div className="st-meta">
            <p>
              <strong>Draws from</strong>
              {v.drawsFrom}
            </p>
            <p>
              <strong>Mood</strong>
              {v.mood}
            </p>
          </div>
        </header>

        <div className="st-preview" aria-label={`Hero mock in the ${v.name} style`}>
          <div className="st-preview-copy">
            <p className="st-eyebrow">{copy.eyebrow}</p>
            <h3 className="st-h1">{copy.headline}</h3>
            <p className="st-lead">{copy.subheadline}</p>
            <div className="st-inline">
              <input className="st-input" type="email" placeholder={copy.cta.placeholder} aria-label={copy.cta.label} />
              <button type="button" className="st-btn is-primary">
                {copy.cta.button}
              </button>
            </div>
            <p className="st-trust">{copy.cta.under}</p>
          </div>
          <div className="st-room">
            <div className="st-room-bar">
              <span>The room</span>
              <span>3 agents</span>
            </div>
            {agents.map((a) => (
              <div key={a.name} className="st-agent" style={{ "--dot": c.agents[a.color] } as CSSProperties}>
                <span className="st-agent-dot" aria-hidden />
                <span className="st-agent-name">{a.name}</span>
                <span className="st-status">{a.status}</span>
              </div>
            ))}
            <div className="st-say">
              <b>hey Juno,</b> run the tests
            </div>
          </div>
        </div>

        <div className="st-section">
          <div className="st-label">Colour</div>
          <div className="st-palette">
            <div className="st-swatch-row">
              <Swatch name="Primary" hex={c.primary} on={c.onPrimary} big />
              <Swatch name="Secondary" hex={c.secondary} on={c.onSecondary} big />
              <Swatch name="Accent" hex={c.accent} on={c.bg} big note="links, focus" />
            </div>
            <div>
              <div className="st-group-title">Neutrals</div>
              <div className="st-swatch-row">
                <Swatch name="Page" hex={c.bg} />
                <Swatch name="Surface" hex={c.surface} />
                <Swatch name="Border" hex={c.border} />
                <Swatch name="Muted text" hex={c.muted} />
                <Swatch name="Ink" hex={c.ink} />
              </div>
            </div>
            <div>
              <div className="st-group-title">Tints</div>
              <div className="st-swatch-row">
                {c.tints.map((t) => (
                  <Swatch key={t.name} name={t.name} hex={t.hex} note={t.note} />
                ))}
              </div>
            </div>
            <div>
              <div className="st-group-title">Agents</div>
              <div className="st-swatch-row">
                <Swatch name="Teal" hex={c.agents.teal} />
                <Swatch name="Red" hex={c.agents.red} />
                <Swatch name="Purple" hex={c.agents.purple} />
              </div>
            </div>
            <p className="st-note">{v.colorNotes}</p>
          </div>
        </div>

        <div className="st-section">
          <div className="st-label">Type</div>
          <div>
            <div className="st-fonts">
              <div className="st-font">
                <div className="st-font-sample st-display" style={{ fontWeight: v.type.scale[0].weight }}>
                  Aa Qg
                </div>
                <b>{v.type.display.family}</b>
                <span>Display · {v.type.display.weights}</span>
                <small>{v.type.display.note}</small>
              </div>
              <div className="st-font">
                <div className="st-font-sample">Aa Qg</div>
                <b>{v.type.body.family}</b>
                <span>Body · {v.type.body.weights}</span>
                <small>{v.type.body.note}</small>
              </div>
              <div className="st-font">
                <div className="st-font-sample st-mono">Aa Qg</div>
                <b>{monoFont.family}</b>
                <span>Mono · {monoFont.weights}</span>
                <small>{monoFont.note}</small>
              </div>
            </div>
            <div className="st-scale">
              {v.type.scale.map((s) => (
                <Step key={s.name} step={s} />
              ))}
            </div>
            <p className="st-note">{v.type.notes}</p>
          </div>
        </div>

        <div className="st-section">
          <div className="st-label">Spacing</div>
          <div className="st-spacing">
            <div className="st-bars" aria-label="Spacing scale">
              {v.spacing.steps.map((s) => (
                <div key={s} className="st-bar">
                  <i style={{ "--h": `${Math.min(s, 128)}px` } as CSSProperties} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="st-rhythm">
              <div>
                <b>{v.spacing.section}px</b>
                section padding
              </div>
              <div>
                <b>{v.spacing.gutter}px</b>
                grid gutter
              </div>
              <div>
                <b>{v.spacing.stack}px</b>
                stack between text
              </div>
            </div>
            <p className="st-note">
              Base {v.spacing.base}px. {v.spacing.notes} Radii: buttons {v.radius.button === 999 ? "pill" : `${v.radius.button}px`},
              fields {v.radius.input}px, cards {v.radius.card}px.
            </p>
          </div>
        </div>

        <div className="st-section">
          <div className="st-label">Buttons</div>
          <div className="st-controls">
            <div className="st-row">
              <button type="button" className="st-btn is-primary">
                {copy.cta.button}
              </button>
              <button type="button" className="st-btn is-secondary">
                See it work
              </button>
              <button type="button" className="st-btn is-ghost">
                Read the docs
              </button>
              <button type="button" className="st-btn is-link">
                Open Room on GitHub
              </button>
            </div>
            <div className="st-row">
              <button type="button" className="st-btn is-primary is-small">
                Small primary
              </button>
              <button type="button" className="st-btn is-secondary is-small">
                Small secondary
              </button>
              <button type="button" className="st-btn is-primary" disabled>
                Disabled
              </button>
            </div>
            <p className="st-note">
              {v.controls.height}px tall, {v.controls.fontSize}px at {v.controls.fontWeight}. {v.controls.buttonRule}
            </p>
          </div>
        </div>

        <div className="st-section">
          <div className="st-label">Forms</div>
          <div className="st-controls">
            <form className="st-form" action="#">
              <div className="st-field">
                <label htmlFor={`${v.id}-email`}>Email address</label>
                <input id={`${v.id}-email`} className="st-input" type="email" placeholder={copy.cta.placeholder} />
                <span className="st-help">{copy.cta.under}</span>
              </div>
              <div className="st-field is-error">
                <label htmlFor={`${v.id}-email-err`}>Email address</label>
                <input id={`${v.id}-email-err`} className="st-input" type="email" defaultValue="lincoln@" aria-invalid />
                <span className="st-help">{copy.form.invalid}</span>
              </div>
              <div className="st-field">
                <label htmlFor={`${v.id}-voice`}>Voice</label>
                <div className="st-select-wrap">
                  <select id={`${v.id}-voice`} className="st-select" defaultValue="juno">
                    <option value="juno">Juno · warm, low</option>
                    <option value="atlas">Atlas · quick, bright</option>
                    <option value="vesper">Vesper · even, quiet</option>
                  </select>
                </div>
              </div>
              <div className="st-checks">
                <label>
                  <input type="checkbox" defaultChecked /> Ask before deleting files
                </label>
                <label>
                  <input type="checkbox" /> Read replies aloud
                </label>
                <label>
                  <input type="radio" name={`${v.id}-wake`} defaultChecked /> Hey plus name
                </label>
                <label>
                  <input type="radio" name={`${v.id}-wake`} /> Hotkey
                </label>
              </div>
            </form>
            <p className="st-note">{v.controls.inputRule}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
