import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { copy } from "@/lib/copy";

vi.mock("@/app/actions", () => ({
  joinWaitlist: vi.fn(async () => ({ status: "ok" })),
}));

import { WaitlistForm } from "@/components/waitlist-form";

describe("WaitlistForm", () => {
  test("renders the email field, the button and the line under it", () => {
    render(<WaitlistForm />);
    expect(screen.getByLabelText(copy.cta.label)).toBeDefined();
    expect(screen.getByRole("button", { name: copy.cta.button })).toBeDefined();
    expect(screen.getByText(copy.cta.under)).toBeDefined();
  });
});
