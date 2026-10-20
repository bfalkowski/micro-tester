import { describe, expect, it } from "vitest";
import { BUTTONS, identify } from "./mapping";

const press = (key: string, extra: Partial<Parameters<typeof identify>[0]> = {}) =>
  identify({ key, code: "", shiftKey: false, metaKey: false, ...extra });

describe("identify", () => {
  it("reads the Micro's default keyboard-mode letters", () => {
    expect(press("g")).toEqual({ button: "a", mapping: "default" });
    expect(press("j")).toEqual({ button: "b", mapping: "default" });
    expect(press("c")).toEqual({ button: "up", mapping: "default" });
    expect(press("l")).toEqual({ button: "l", mapping: "default" });
  });

  it("reads the remapped keys from the post's Karabiner rule", () => {
    expect(press("Enter")).toEqual({ button: "a", mapping: "remapped" });
    expect(press("Escape")).toEqual({ button: "b", mapping: "remapped" });
    expect(press("ArrowLeft")).toEqual({ button: "left", mapping: "remapped" });
    expect(press("/")).toEqual({ button: "x", mapping: "remapped" });
    expect(press("Alt", { code: "AltRight" })).toEqual({ button: "l", mapping: "remapped" });
    expect(press("Tab", { shiftKey: true })).toEqual({ button: "r", mapping: "remapped" });
    expect(press("]", { shiftKey: true, metaKey: true })).toEqual({ button: "plus", mapping: "remapped" });
  });

  it("reads Y as Cmd+Tab once remapped", () => {
    expect(press("Tab", { metaKey: true })).toEqual({ button: "y", mapping: "remapped" });
    expect(press("i")).toEqual({ button: "y", mapping: "default" });
  });

  it("treats buttons the rule leaves alone as the same in both mappings", () => {
    expect(press("k")).toEqual({ button: "extra1", mapping: "either" });
  });

  it("ignores keys no button sends", () => {
    expect(press("q")).toBeNull();
    expect(press("Alt", { code: "AltLeft" })).toBeNull();
    expect(press("Tab")).toBeNull();
  });

  it("matches letters regardless of case", () => {
    expect(press("G")).toEqual({ button: "a", mapping: "default" });
  });
});

describe("BUTTONS", () => {
  it("gives every button an action label", () => {
    for (const b of BUTTONS) expect(b.action.length).toBeGreaterThan(0);
  });
});
