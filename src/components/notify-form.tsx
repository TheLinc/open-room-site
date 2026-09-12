"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { joinWaitlist } from "@/app/actions";
import { copy } from "@/lib/copy";
import type { WaitlistResult } from "@/lib/waitlist";

// Stands in for the download button until the first release. The email field
// and the filled button share a row with anything passed as children; the
// line under the row turns into the error or the confirmation.
//
// Plain state, not useActionState: an action's result commits as a
// transition, and the hero timeline's per-frame updates hold transitions back
// until its script ends, so a signup in the first half minute sat pending.
export function NotifyForm({
  id,
  align = "start",
  className = "",
  children,
}: {
  id?: string;
  align?: "start" | "center";
  className?: string;
  children?: ReactNode;
}) {
  const [state, setState] = useState<WaitlistResult>({ status: "idle" });
  const [pending, setPending] = useState(false);
  const inputId = useId();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    setPending(true);
    try {
      setState(await joinWaitlist(email));
    } catch {
      setState({ status: "error", message: copy.form.failed });
    } finally {
      setPending(false);
    }
  }

  const done = state.status === "ok" || state.status === "already";
  const centred = align === "center";

  return (
    <form
      id={id}
      onSubmit={submit}
      className={`flex w-full scroll-mt-24 flex-col gap-3 ${centred ? "items-center text-center" : ""} ${className}`}
    >
      {done && !children ? null : (
        <div
          className={`flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap ${centred ? "sm:justify-center" : ""}`}
        >
          {done ? null : (
            <>
              <label htmlFor={inputId} className="sr-only">
                {copy.form.label}
              </label>
              <input
                id={inputId}
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={copy.form.placeholder}
                className="h-11 w-full rounded-lg border border-line bg-card px-3.5 text-[15px] text-ink placeholder:text-muted sm:w-64"
              />
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg bg-ink px-5 text-[15px] font-medium text-white transition-colors hover:bg-ink-2 disabled:opacity-60"
              >
                {copy.form.button}
              </button>
            </>
          )}
          {children}
        </div>
      )}
      <p
        role={done ? "status" : undefined}
        aria-live="polite"
        className={
          state.status === "error"
            ? "text-[14px] text-block"
            : done
              ? "text-[15px] text-ink"
              : "text-[14px] text-ink-2"
        }
      >
        {state.status === "error"
          ? state.message
          : state.status === "ok"
            ? copy.form.ok
            : state.status === "already"
              ? copy.form.already
              : copy.form.under}
      </p>
    </form>
  );
}
