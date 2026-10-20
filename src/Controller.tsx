import { BUTTONS, type ButtonId } from "./mapping";

const ACTION = Object.fromEntries(BUTTONS.map((b) => [b.id, b.action])) as Record<ButtonId, string>;

interface Shape {
  id: ButtonId;
  kind: "round" | "small" | "dpad" | "shoulder";
  x: number;
  y: number;
  label: { x: number; y: number; anchor: "start" | "middle" | "end" };
  text?: string;
}

const SHAPES: Shape[] = [
  { id: "l", kind: "shoulder", x: 170, y: 52, text: "L", label: { x: 170, y: 30, anchor: "middle" } },
  { id: "r", kind: "shoulder", x: 470, y: 52, text: "R", label: { x: 470, y: 30, anchor: "middle" } },
  { id: "up", kind: "dpad", x: 170, y: 132, label: { x: 170, y: 104, anchor: "middle" } },
  { id: "down", kind: "dpad", x: 170, y: 208, label: { x: 170, y: 252, anchor: "middle" } },
  { id: "left", kind: "dpad", x: 132, y: 170, label: { x: 104, y: 174, anchor: "end" } },
  { id: "right", kind: "dpad", x: 208, y: 170, label: { x: 236, y: 174, anchor: "start" } },
  { id: "minus", kind: "small", x: 262, y: 128, text: "−", label: { x: 262, y: 104, anchor: "middle" } },
  { id: "plus", kind: "small", x: 378, y: 128, text: "+", label: { x: 378, y: 104, anchor: "middle" } },
  { id: "extra1", kind: "small", x: 262, y: 212, text: "", label: { x: 262, y: 248, anchor: "middle" } },
  { id: "extra2", kind: "small", x: 378, y: 212, text: "", label: { x: 378, y: 248, anchor: "middle" } },
  { id: "x", kind: "round", x: 470, y: 124, text: "X", label: { x: 470, y: 96, anchor: "middle" } },
  { id: "y", kind: "round", x: 424, y: 170, text: "Y", label: { x: 396, y: 174, anchor: "end" } },
  { id: "a", kind: "round", x: 516, y: 170, text: "A", label: { x: 544, y: 174, anchor: "start" } },
  { id: "b", kind: "round", x: 470, y: 216, text: "B", label: { x: 470, y: 256, anchor: "middle" } },
];

function ButtonShape({ s, active }: { s: Shape; active: boolean }) {
  const cls = `btn btn-${s.kind}${active ? " is-active" : ""}${ACTION[s.id] === "Unused" ? " is-unused" : ""}`;
  let body;
  if (s.kind === "round") body = <circle cx={s.x} cy={s.y} r={20} />;
  else if (s.kind === "small") body = <circle cx={s.x} cy={s.y} r={13} />;
  else if (s.kind === "shoulder") body = <rect x={s.x - 50} y={s.y - 12} width={100} height={22} rx={10} />;
  else body = <rect x={s.x - 18} y={s.y - 18} width={36} height={36} rx={6} />;
  return (
    <g className={cls} data-button={s.id}>
      {body}
      {s.text && (
        <text className="btn-text" x={s.x} y={s.y + (s.kind === "shoulder" ? 4 : 6)} textAnchor="middle">
          {s.text}
        </text>
      )}
      <text className="btn-label" x={s.label.x} y={s.label.y} textAnchor={s.label.anchor}>
        {ACTION[s.id]}
      </text>
    </g>
  );
}

export function Controller({ active }: { active: ReadonlySet<ButtonId> }) {
  return (
    <svg className="controller" viewBox="0 0 640 300" role="img" aria-label="8BitDo Micro with each button's action">
      <rect className="body" x={60} y={58} width={520} height={226} rx={100} />
      <rect className="dpad-hub" x={152} y={152} width={36} height={36} />
      {SHAPES.map((s) => (
        <ButtonShape key={s.id} s={s} active={active.has(s.id)} />
      ))}
    </svg>
  );
}
