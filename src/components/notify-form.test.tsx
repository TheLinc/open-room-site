import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { copy } from "@/lib/copy";

const joinWaitlist = vi.hoisted(() => vi.fn());
vi.mock("@/app/actions", () => ({ joinWaitlist }));

afterEach(cleanup);

import { NotifyForm } from "@/components/notify-form";

function submit(email: string) {
  fireEvent.change(screen.getByLabelText(copy.form.label), {
    target: { value: email },
  });
  fireEvent.click(screen.getByRole("button", { name: copy.form.button }));
}

describe("NotifyForm", () => {
  test("renders the email field, the button and the line under it", () => {
    render(<NotifyForm />);
    expect(screen.getByLabelText(copy.form.label)).toBeDefined();
    expect(screen.getByRole("button", { name: copy.form.button })).toBeDefined();
    expect(screen.getByText(copy.form.under)).toBeDefined();
  });

  test("sends the email and swaps the field for the confirmation", async () => {
    joinWaitlist.mockResolvedValueOnce({ status: "ok" });
    render(
      <NotifyForm>
        <a href="#source">source</a>
      </NotifyForm>,
    );
    submit("a@example.com");
    expect(await screen.findByRole("status")).toHaveProperty(
      "textContent",
      copy.form.ok,
    );
    expect(joinWaitlist).toHaveBeenCalledWith("a@example.com");
    expect(
      screen.getByLabelText(copy.form.label).closest("[inert]"),
    ).not.toBeNull();
    expect(screen.getByText("source")).toBeDefined();
  });

  test("shows the error and keeps the field", async () => {
    joinWaitlist.mockRejectedValueOnce(new Error("offline"));
    render(<NotifyForm />);
    submit("a@example.com");
    expect(await screen.findByText(copy.form.failed)).toBeDefined();
    expect(screen.getByLabelText(copy.form.label)).toBeDefined();
  });
});
