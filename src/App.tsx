import { useEffect, useState } from "react";
import { Controller } from "./Controller";
import { BUTTONS, identify, type ButtonId, type Mapping } from "./mapping";

const MIN_FLASH_MS = 180;
const EMBEDDED = new URLSearchParams(location.search).has("embed");

const MAPPING_TEXT: Record<Mapping, string> = {
  default: "the Micro's default letters",
  remapped: "the Karabiner remap",
  either: "either mapping (this button is not remapped)",
};

interface LastPress {
  key: string;
  button: ButtonId | null;
  mapping: Mapping | null;
}

const describeKey = (e: KeyboardEvent) =>
  [e.metaKey && "Cmd", e.shiftKey && e.key !== "Shift" && "Shift", e.code === "AltRight" ? "Right Option" : e.key]
    .filter(Boolean)
    .join("+");

export function App() {
  const [active, setActive] = useState<ReadonlySet<ButtonId>>(new Set());
  const [last, setLast] = useState<LastPress | null>(null);
  const [focused, setFocused] = useState(() => document.hasFocus());

  useEffect(() => {
    const on = () => setFocused(true);
    const off = () => setFocused(false);
    window.addEventListener("focus", on);
    window.addEventListener("blur", off);
    return () => {
      window.removeEventListener("focus", on);
      window.removeEventListener("blur", off);
    };
  }, []);

  useEffect(() => {
    if (!EMBEDDED) return;
    const report = () => parent.postMessage({ microTesterHeight: document.documentElement.scrollHeight }, "*");
    const ro = new ResizeObserver(report);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const downAt = new Map<ButtonId, number>();
    const release = (id: ButtonId) =>
      setActive((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

    const onDown = (e: KeyboardEvent) => {
      const hit = identify(e);
      setLast({ key: describeKey(e), button: hit?.button ?? null, mapping: hit?.mapping ?? null });
      if (!hit) return;
      e.preventDefault();
      downAt.set(hit.button, performance.now());
      setActive((prev) => new Set(prev).add(hit.button));
    };

    const onUp = (e: KeyboardEvent) => {
      const hit = identify(e) ?? (e.code === "AltRight" ? { button: "l" as ButtonId } : null);
      const ids = hit ? [hit.button] : [...downAt.keys()];
      for (const id of ids) {
        const held = performance.now() - (downAt.get(id) ?? 0);
        downAt.delete(id);
        setTimeout(() => release(id), Math.max(0, MIN_FLASH_MS - held));
      }
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  const name = last?.button ? BUTTONS.find((b) => b.id === last.button)!.name : null;

  return (
    <main className={EMBEDDED ? "embedded" : undefined} onClick={() => window.focus()}>
      {!EMBEDDED && (
        <>
          <h1>Micro Tester</h1>
          <p className="lede">Press a button on your 8BitDo Micro. Its drawing lights up, with the key it sent and what it does in Claude Code.</p>
        </>
      )}
      <Controller active={active} />
      <p className={`readout${focused ? "" : " is-waiting"}`} aria-live="polite">
        {!focused && "Click here, then press a button."}
        {focused && !last && "Waiting for a press."}
        {focused && last && !name && <>Got <kbd>{last.key}</kbd>, which no Micro button sends.</>}
        {focused && last && name && (
          <>
            <strong>{name}</strong> sent <kbd>{last.key}</kbd>, matching {MAPPING_TEXT[last.mapping!]}.
          </>
        )}
      </p>
      <p className="note">Plus and minus switch browser tabs when remapped, so this page may lose focus when you press them.</p>
    </main>
  );
}
