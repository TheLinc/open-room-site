"use client";

import { useActionState } from "react";
import { joinWaitlist } from "@/app/actions";
import { copy } from "@/lib/copy";
import type { WaitlistResult } from "@/lib/waitlist";

const initial: WaitlistResult = { status: "idle" };

export type WaitlistLook = {
  input: string;
  button: string;
  note: string;
  error: string;
  status: string;
};

// The site's dark look. A themed page passes its own classes instead.
export const darkLook: WaitlistLook = {
  input:
    "h-11 flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-base text-foreground placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none",
  button: "h-11 rounded-md bg-foreground px-4 text-base font-medium text-background disabled:opacity-60",
  note: "text-sm text-zinc-400",
  error: "text-sm text-agent-red",
  status: "text-base text-zinc-200",
};

export function WaitlistForm({ look = darkLook }: { look?: WaitlistLook }) {
  const [state, formAction, pending] = useActionState(joinWaitlist, initial);

  if (state.status === "ok" || state.status === "already") {
    return (
      <p role="status" className={look.status}>
        {state.status === "ok" ? copy.form.ok : copy.form.already}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="email" className="sr-only">
          {copy.cta.label}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={copy.cta.placeholder}
          className={look.input}
        />
        <button type="submit" disabled={pending} className={look.button}>
          {copy.cta.button}
        </button>
      </div>
      <p aria-live="polite" className={state.status === "error" ? look.error : look.note}>
        {state.status === "error" ? state.message : copy.cta.under}
      </p>
    </form>
  );
}
