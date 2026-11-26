// The Printer Finally Answers — make.fun entry.
// Writes the office printer's one-line comeback to /output/entry.txt,
// after checking it against the competition gate (1-240 characters,
// one line, UTF-8, not only whitespace).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The winner of 10 compared variants (see printer-variants.md):
// the printer finally speaks, and the punchline is that in 41,208 pages
// nobody has ever read a word it wrote. First-person machine voice,
// an exact sheet count (the flat logic of a device that has counted
// every sheet it ever fed), a twist that lands in one read — and no
// jam, error-code or thump cliché: the joke is about being read,
// not about being broken.
const LINE =
  "I have printed 41,208 pages for you, and this is the first time anyone has ever read what I wrote.";

// Gate from the competition rules: 1-240 characters, one line,
// not blank, no control characters other than a trailing newline.
const MAX_CHARS = 240;
function checkGate(text: string): number {
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`gate: ${chars} characters, need 1-${MAX_CHARS}`);
  }
  if (!text.trim()) throw new Error("gate: entry is only whitespace");
  if (/[\r\n]/.test(text)) throw new Error("gate: entry must be one line");
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
    throw new Error("gate: entry holds control characters");
  }
  return chars;
}

const chars = checkGate(LINE);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE + "\n", "utf8");
// Round-trip check: read the file back and re-run the gate on what was
// actually written, so a truncated or altered write cannot pass silently.
const written = readFileSync("/output/entry.txt", "utf8").replace(/\n$/, "");
if (written !== LINE) throw new Error("round-trip: file differs from LINE");
checkGate(written);
console.log(`wrote /output/entry.txt (${chars} characters)`);
console.log(LINE);
