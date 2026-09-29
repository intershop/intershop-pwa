// Human-in-the-loop reproduction loop.
// Copy this file, edit the steps below, and run it with `node <copy>.mjs`.
// The agent runs the script; the user follows the prompts in their terminal.
//
// Two helpers:
//   await step('<instruction>')         -> show instruction, wait for Enter
//   await capture('KEY', '<question>')  -> show question, store the answer under KEY
//
// At the end, captured values are printed as KEY=VALUE for the agent to parse.
//
// `capture` prints its value back to the terminal, where the agent reads it,
// so capture observations, and leave signing in to the user as a `step`.

import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline';

const rl = createInterface({ input });
// the iterator buffers lines, so answers typed or piped ahead of a prompt are not lost
const lines = rl[Symbol.asyncIterator]();
const captured = {};

async function ask(prompt) {
  output.write(prompt);
  const { value = '' } = await lines.next();
  return value;
}

async function step(instruction) {
  await ask(`\n>>> ${instruction}\n    [Enter when done] `);
}

async function capture(key, question) {
  captured[key] = await ask(`\n>>> ${question}\n    > `);
}

// --- edit below ---------------------------------------------------------

await step('Open the PWA at http://localhost:4200 and sign in.');

await capture('ERRORED', 'Add a product to the cart. Did an error appear? (y/n)');

await capture('ERROR_MSG', "Paste the error message (or 'none'):");

// --- edit above ---------------------------------------------------------

rl.close();

console.log('\n--- Captured ---');
for (const [key, value] of Object.entries(captured)) {
  console.log(`${key}=${value}`);
}
