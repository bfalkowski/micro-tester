# Micro Tester

A web page that shows what each button on an 8BitDo Micro does. Press a button and its drawing lights up, with the key it sent and the action it triggers in Claude Code.

It is built to fix the problem described in [Steering Claude Code Without a Keyboard](https://bfalkowski.github.io/writing/hands-free.html): the controller's buttons say A, B, X and Y, not what they do.

## What it should do

- Draw the Micro: D-pad, A, B, X, Y, plus, minus, the L and R shoulder buttons, and the two remaining buttons.
- Light up a button when its key is pressed, with a short animation, and show the key name that arrived.
- Show each button's current action beside it, from one mapping table.
- Recognise both the Micro's default keyboard-mode letters (A sends `g`, B sends `j`, and so on) and the remapped keys from the post's Karabiner rule, and say which mapping it detected.
- Work at phone width and in light and dark mode.

## Stack

Vite, React and TypeScript, with Vitest for the key-mapping logic. Deployed with GitHub Pages.
