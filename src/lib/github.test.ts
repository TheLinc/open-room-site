import { describe, expect, test } from "vitest";
import { formatStars, windowsInstaller } from "@/lib/github";

const asset = (name: string) => ({
  name,
  browser_download_url: `https://example.test/${name}`,
});

describe("windowsInstaller", () => {
  test("takes the setup exe from the newest published release", () => {
    expect(
      windowsInstaller([
        { draft: true, assets: [asset("open-room-0.2.0-setup.exe")] },
        {
          draft: false,
          assets: [
            asset("open-room-0.1.1.dmg"),
            asset("open-room-0.1.1-setup.exe"),
          ],
        },
        { draft: false, assets: [asset("open-room-0.1.0-setup.exe")] },
      ]),
    ).toBe("https://example.test/open-room-0.1.1-setup.exe");
  });

  test("returns null when no release carries an installer", () => {
    expect(windowsInstaller([])).toBeNull();
    expect(
      windowsInstaller([
        { draft: false, assets: [asset("open-room-0.1.1.dmg")] },
      ]),
    ).toBeNull();
  });
});

describe("formatStars", () => {
  test("rounds thousands", () => {
    expect(formatStars(12)).toBe("12");
    expect(formatStars(1500)).toBe("1.5k");
    expect(formatStars(12400)).toBe("12k");
  });
});
