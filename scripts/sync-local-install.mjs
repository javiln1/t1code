#!/usr/bin/env node

import { readdirSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const tuiDir = path.join(repoRoot, "apps", "tui");

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    encoding: "utf8",
    ...options,
  });

  if (result.status !== 0) {
    fail(`${command} ${args.join(" ")} failed.`);
  }
}

function newestPackedTarball(directory) {
  const tgzFiles = readdirSync(directory)
    .filter((entry) => entry.endsWith(".tgz"))
    .map((entry) => path.join(directory, entry))
    .toSorted((a, b) => a.localeCompare(b));

  const latest = tgzFiles.at(-1);
  if (!latest) {
    fail(`No .tgz package was produced in ${directory}`);
  }
  return latest;
}

run("bun", ["build:tui"]);
run("npm", ["pack"], { cwd: tuiDir });

const packageTarball = newestPackedTarball(tuiDir);
run("bun", ["add", "-g", packageTarball], { cwd: repoRoot });

process.stdout.write(`Local t1code install refreshed from ${packageTarball}\n`);
