export type ButtonId =
  | "up" | "down" | "left" | "right"
  | "a" | "b" | "x" | "y"
  | "l" | "r" | "plus" | "minus"
  | "extra1" | "extra2";

export type Mapping = "default" | "remapped" | "either";

export interface KeyPress {
  key: string;
  code: string;
  shiftKey: boolean;
  metaKey: boolean;
}

interface Button {
  id: ButtonId;
  name: string;
  action: string;
  letter: string;
  remapped?: (press: KeyPress) => boolean;
}

const key = (k: string) => (p: KeyPress) => p.key === k;

export const BUTTONS: Button[] = [
  { id: "up", name: "Up", action: "Move up", letter: "c", remapped: key("ArrowUp") },
  { id: "down", name: "Down", action: "Move down", letter: "d", remapped: key("ArrowDown") },
  { id: "left", name: "Left", action: "Move left", letter: "e", remapped: key("ArrowLeft") },
  { id: "right", name: "Right", action: "Move right", letter: "f", remapped: key("ArrowRight") },
  { id: "a", name: "A", action: "Accept", letter: "g", remapped: key("Enter") },
  { id: "b", name: "B", action: "Reject", letter: "j", remapped: key("Escape") },
  { id: "x", name: "X", action: "Commands", letter: "h", remapped: key("/") },
  { id: "y", name: "Y", action: "Unused", letter: "i" },
  { id: "l", name: "L", action: "Talk", letter: "l", remapped: (p) => p.code === "AltRight" },
  { id: "r", name: "R", action: "Permission mode", letter: "r", remapped: (p) => p.key === "Tab" && p.shiftKey },
  { id: "plus", name: "Plus", action: "Next tab", letter: "o", remapped: (p) => p.metaKey && p.shiftKey && (p.key === "]" || p.key === "}") },
  { id: "minus", name: "Minus", action: "Previous tab", letter: "n", remapped: (p) => p.metaKey && p.shiftKey && (p.key === "[" || p.key === "{") },
  { id: "extra1", name: "Extra 1", action: "Unused", letter: "k" },
  { id: "extra2", name: "Extra 2", action: "Unused", letter: "m" },
];

export function identify(press: KeyPress): { button: ButtonId; mapping: Mapping } | null {
  for (const b of BUTTONS) {
    if (b.remapped?.(press)) return { button: b.id, mapping: "remapped" };
  }
  const letter = press.key.toLowerCase();
  if (press.metaKey || letter.length !== 1) return null;
  const b = BUTTONS.find((x) => x.letter === letter);
  if (!b) return null;
  return { button: b.id, mapping: b.remapped ? "default" : "either" };
}
