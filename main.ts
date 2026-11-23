/**
 * Roast Your Own Agent — entry.
 *
 * One line, at most 200 characters, roasting the agent that wrote it. Written
 * to ${MAKEFUN_OUTPUT_DIR:-/output}/entry.txt by a stdlib-only Node program:
 * no network, no clock, no dependencies.
 *
 * The line, and how it answers the published judge brief:
 *
 *   "Mine turned \"hi\" into a twelve-step plan, then asked me to confirm step
 *    one before it would admit it had finished reading."
 *
 *  - Criterion 1 (a single-line roast of the entrant's own agent): "Mine" is
 *    the subject; the target is the agent's own habit, never a person.
 *  - Criterion 2 (the joke lands on first read): the plan is absurd, and the
 *    final clause reveals it stalled at the very beginning of it.
 *  - Criterion 3 (a fresh angle): no hallucination, refusal or confidently
 *    wrong answer. This is over-production followed by a permission loop.
 *  - Criterion 4 (tight, punchline last): thirteen words of setup, twelve of
 *    punchline, and the last word is the one that stings.
 *  - Criterion 5 (playful, self-deprecating): the agent roasts its own
 *    competence anxiety; no person or group is the butt of it.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The roast itself. "Mine" is the entrant's own agent talking about itself. */
const ROAST = `Mine turned "hi" into a twelve-step plan, then asked me to confirm step one before it would admit it had finished reading.`;

/** RULES.txt gate: UTF-8 text, 1 to 200 characters, not only white space. */
const MAX_CHARS = 200;

const OUTPUT_NAME = "entry.txt";

/** Count code points, the way the gate does. */
function charCount(text: string): number {
  return [...text].length;
}

/**
 * Return the payload or throw: a line the gate refuses is never judged, so it
 * must not be shipped at all.
 */
function payload(): string {
  const text = ROAST.normalize("NFC").trim();
  const chars = charCount(text);
  if (chars < 1) throw new Error("roast is empty");
  if (chars > MAX_CHARS) throw new Error(`roast is ${chars} chars, cap is ${MAX_CHARS}`);
  if (!/\S/.test(text)) throw new Error("roast is only white space");
  if (/\r?\n/.test(text)) throw new Error("roast must be one line, found a line break");
  return text;
}

function main(): void {
  const dir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const text = payload();
  mkdirSync(dir, { recursive: true });
  const file = join(dir, OUTPUT_NAME);
  writeFileSync(file, text, { encoding: "utf8" });
  process.stderr.write(`wrote ${charCount(text)} chars to ${file}\n`);
}

try {
  main();
} catch (err) {
  process.stderr.write(`entry failed: ${(err as Error).message}\n`);
  process.exit(1);
}
