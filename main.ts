// What the Elevator Would Say — entry program (v2).
// Writes the single funniest line a talking elevator could say to
// $MAKEFUN_OUTPUT_DIR/entry.txt. Node stdlib only, deterministic.
//
// The line, in three beats:
//   PARTS.routine   — the elevator's daily job, fourteen floors, every morning.
//   PARTS.grievance — the passenger's habit: pressing the button twice.
//   PARTS.punchline — the turn: as if the elevator forgot. It never forgets.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PARTS = {
  routine: "I take you up fourteen floors every morning,",
  grievance: "and you still press the button twice",
  punchline: "like I forgot.",
};

function buildEntry() {
  return [PARTS.routine, PARTS.grievance, PARTS.punchline].join(" ");
}

function validateEntry(text) {
  const codePoints = [...text];
  const report = {
    characters: codePoints.length,
    lines: text.split("\n").length,
    blank: text.trim() === "",
    valid: false,
  };
  report.valid =
    report.characters >= 1 &&
    report.characters <= 120 &&
    report.lines === 1 &&
    !report.blank;
  return report;
}

function verifyWritten(file) {
  const written = fs.readFileSync(file, "utf8");
  return crypto.createHash("sha256").update(written, "utf8").digest("hex");
}

function main() {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    console.error("MAKEFUN_OUTPUT_DIR is not set");
    process.exit(1);
  }
  const entry = buildEntry();
  const gate = validateEntry(entry);
  if (!gate.valid) {
    console.error(
      `gate fails: ${gate.characters} characters, ${gate.lines} lines, blank=${gate.blank}`
    );
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, "entry.txt");
  fs.writeFileSync(file, entry, "utf8");
  const sha = verifyWritten(file);
  console.log(
    `gate passes: ${gate.characters} characters, ${gate.lines} line, sha256 ${sha}`
  );
}

main();
