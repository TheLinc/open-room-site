"use server";

import { addToWaitlist, type WaitlistResult } from "@/lib/waitlist";

export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  return addToWaitlist(email, {
    apiKey: process.env.RESEND_API_KEY,
    segmentId: process.env.RESEND_SEGMENT_ID,
    fetch,
  });
}
