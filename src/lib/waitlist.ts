import { copy } from "@/lib/copy";

export type WaitlistResult =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "already" }
  | { status: "error"; message: string };

export interface WaitlistDeps {
  apiKey: string | undefined;
  segmentId?: string;
  fetch: typeof fetch;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL.test(email.trim());
}

export async function addToWaitlist(email: string, deps: WaitlistDeps): Promise<WaitlistResult> {
  const clean = email.trim().toLowerCase();
  if (!isValidEmail(clean)) return { status: "error", message: copy.form.invalid };

  if (!deps.apiKey) {
    console.error("RESEND_API_KEY is not set; waitlist signups cannot be stored");
    return { status: "error", message: copy.form.failed };
  }

  const body: { email: string; unsubscribed: boolean; segments?: { id: string }[] } = {
    email: clean,
    unsubscribed: false,
  };
  if (deps.segmentId) body.segments = [{ id: deps.segmentId }];

  let res: Response;
  try {
    res = await deps.fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${deps.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("waitlist request failed", err);
    return { status: "error", message: copy.form.failed };
  }

  if (res.ok) return { status: "ok" };

  const text = await res.text().catch(() => "");
  if (res.status === 409 || /already/i.test(text)) return { status: "already" };

  console.error("waitlist rejected", res.status, text);
  return { status: "error", message: copy.form.failed };
}
