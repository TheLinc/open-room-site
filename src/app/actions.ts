"use server";

import { addToWaitlist, type WaitlistResult } from "@/lib/waitlist";

export async function joinWaitlist(
  _previous: WaitlistResult,
  formData: FormData,
): Promise<WaitlistResult> {
  const email = String(formData.get("email") ?? "");
  return addToWaitlist(email, {
    apiKey: process.env.RESEND_API_KEY,
    segmentId: process.env.RESEND_SEGMENT_ID,
    fetch,
  });
}
