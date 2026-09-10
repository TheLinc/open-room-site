import type { ReactNode } from "react";
import { ChevronIcon } from "@/components/icons";

// The app's controls, drawn small for the page: the same labels, inputs,
// selects and switches the editor and settings dialogs use, on the page's
// own surface. Every panel below the hero is built from these so the
// drawings agree with each other and with the app.

export function Sheet({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-3.5 rounded-panel border border-line bg-card p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  control,
}: {
  label: string;
  hint?: string;
  children?: ReactNode;
  /** A control on the label's row, such as a switch. */
  control?: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-0.5">
          <span className="text-[13px] font-medium leading-5 text-ink">
            {label}
          </span>
          {hint && !children ? (
            <span className="text-[12px] leading-[1.45] text-muted">
              {hint}
            </span>
          ) : null}
        </div>
        {control}
      </div>
      {children}
      {hint && children ? (
        <span className="text-[12px] leading-[1.45] text-muted">{hint}</span>
      ) : null}
    </div>
  );
}

export function Input({
  children,
  mono = false,
  className = "",
}: {
  children: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`flex h-8 min-w-0 items-center rounded-lg border border-line bg-card px-2.5 text-[13px] text-ink ${mono ? "font-mono text-[12px]" : ""} ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}

export function Select({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`flex h-8 min-w-0 items-center justify-between gap-2 rounded-lg border border-line bg-card px-2.5 text-[13px] text-ink ${className}`}
    >
      <span className="truncate">{children}</span>
      <ChevronIcon size={12} className="shrink-0 text-muted" />
    </span>
  );
}

export function Switch({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      role="img"
      aria-label={`${label}: ${on ? "on" : "off"}`}
      className={`relative mt-0.5 inline-block h-[18px] w-8 shrink-0 rounded-full transition-colors ${on ? "bg-ink" : "bg-line"}`}
    >
      <i
        className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-card shadow-[0_1px_2px_rgb(0_0_0/0.2)] ${on ? "left-[16px]" : "left-[2px]"}`}
      />
    </span>
  );
}

export function Button({
  children,
  primary = false,
  className = "",
}: {
  children: ReactNode;
  primary?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-medium ${primary ? "bg-ink text-white" : "border border-line bg-card text-ink"} ${className}`}
    >
      {children}
    </span>
  );
}

/** A hairline row in the thread: thinking, a tool, a finished turn. */
export function ThreadRow({
  icon,
  children,
  className = "",
}: {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-8 items-center gap-2 rounded-md border border-line px-2.5 text-[12px] text-ink-2 ${className}`}
    >
      <span className="text-muted">{icon}</span>
      {children}
    </div>
  );
}
