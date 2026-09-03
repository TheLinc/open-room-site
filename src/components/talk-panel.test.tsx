import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { TalkPanel } from "@/components/talk-panel";
import { stateAt } from "@/lib/hero-script";

describe("TalkPanel", () => {
  test("shows the typed line, replies and pips at the report beat", () => {
    render(<TalkPanel state={stateAt(13500)} />);
    expect(screen.getByText("hey Atlas, what's the status of my CI pipeline?")).toBeDefined();
    expect(screen.getByText("Let me check that for you.")).toBeDefined();
    expect(screen.getByText("The CI pipeline ran successfully.")).toBeDefined();
    expect(screen.getByText("Atlas · done")).toBeDefined();
    expect(screen.getByText("Juno · working")).toBeDefined();
  });

  test("shows a caret only while typing", () => {
    const { rerender } = render(<TalkPanel state={stateAt(1500)} />);
    expect(screen.queryByTestId("caret")).not.toBeNull();
    rerender(<TalkPanel state={stateAt(3000)} />);
    expect(screen.queryByTestId("caret")).toBeNull();
  });

  test("is hidden from assistive tech and fades at the end", () => {
    const { container } = render(<TalkPanel state={stateAt(17500)} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.className).toContain("opacity-0");
  });
});
