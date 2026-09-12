import { describe, expect, test, vi } from "vitest";
import { addToWaitlist, isValidEmail } from "@/lib/waitlist";
import { copy } from "@/lib/copy";

function fetchReturning(status: number, body = "") {
  return vi.fn(
    async () => new Response(body, { status }),
  ) as unknown as typeof fetch;
}

const deps = (f: typeof fetch, segmentId?: string) => ({
  apiKey: "re_test",
  segmentId,
  fetch: f,
});

describe("isValidEmail", () => {
  test("accepts a plain address and rejects junk", () => {
    expect(isValidEmail("lincoln@example.com")).toBe(true);
    expect(isValidEmail("  lincoln@example.com ")).toBe(true);
    expect(isValidEmail("lincoln")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("addToWaitlist", () => {
  test("rejects an invalid email without calling the API", async () => {
    const f = fetchReturning(200);
    expect(await addToWaitlist("nope", deps(f))).toEqual({
      status: "error",
      message: copy.form.invalid,
    });
    expect(f).not.toHaveBeenCalled();
  });

  test("fails cleanly when the API key is missing", async () => {
    const f = fetchReturning(200);
    const result = await addToWaitlist("a@example.com", {
      apiKey: undefined,
      fetch: f,
    });
    expect(result).toEqual({ status: "error", message: copy.form.failed });
    expect(f).not.toHaveBeenCalled();
  });

  test("posts the contact to Resend and reports ok", async () => {
    const f = fetchReturning(200, JSON.stringify({ id: "c_1" }));
    expect(await addToWaitlist(" A@Example.com ", deps(f, "seg_1"))).toEqual({
      status: "ok",
    });
    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/contacts");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer re_test",
    );
    expect(JSON.parse(init.body as string)).toEqual({
      email: "a@example.com",
      unsubscribed: false,
      segments: [{ id: "seg_1" }],
    });
  });

  test("omits segments when no segment id is configured", async () => {
    const f = fetchReturning(200);
    await addToWaitlist("a@example.com", deps(f));
    const [, init] = (f as unknown as ReturnType<typeof vi.fn>).mock
      .calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({
      email: "a@example.com",
      unsubscribed: false,
    });
  });

  test("treats an existing contact as already on the list", async () => {
    expect(
      await addToWaitlist("a@example.com", deps(fetchReturning(409))),
    ).toEqual({ status: "already" });
    const f = fetchReturning(
      422,
      JSON.stringify({ message: "Contact already exists" }),
    );
    expect(await addToWaitlist("a@example.com", deps(f))).toEqual({
      status: "already",
    });
  });

  test("reports other failures and network errors", async () => {
    expect(
      await addToWaitlist("a@example.com", deps(fetchReturning(500))),
    ).toEqual({
      status: "error",
      message: copy.form.failed,
    });
    const boom = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    expect(await addToWaitlist("a@example.com", deps(boom))).toEqual({
      status: "error",
      message: copy.form.failed,
    });
  });
});
