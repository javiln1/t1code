#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  accessSync,
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const homeDir = os.homedir();

const appName = process.env.T1CODE_LAUNCHER_NAME?.trim() || "T1Code";
const bundleId = process.env.T1CODE_LAUNCHER_BUNDLE_ID?.trim() || "com.javiln1.t1code.launcher";
const launcherDir = process.env.T1CODE_LAUNCHER_DIR?.trim() || path.join(homeDir, "Applications");
const launcherAppPath = path.join(launcherDir, `${appName}.app`);
const ghosttyAppPath = process.env.T1CODE_GHOSTTY_APP_PATH?.trim() || "/Applications/Ghostty.app";
const ghosttyIconPath = path.join(ghosttyAppPath, "Contents", "Resources", "Ghostty.icns");
const t1codeBinPath =
  process.env.T1CODE_BIN_PATH?.trim() || path.join(homeDir, ".bun", "bin", "t1code");
const bunBinDir = path.dirname(t1codeBinPath);

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });

  if (result.status === 0) {
    return result;
  }

  const details = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  fail(
    details
      ? `${command} ${args.join(" ")} failed:\n${details}`
      : `${command} ${args.join(" ")} failed.`,
  );
}

function appleScriptString(value) {
  if (value.includes('"')) {
    fail(`AppleScript string cannot contain double quotes: ${value}`);
  }
  return `"${value}"`;
}

function requireExecutable(filePath, description) {
  if (!existsSync(filePath)) {
    fail(`${description} not found at ${filePath}`);
  }
  accessSync(filePath, constants.X_OK);
}

function setPlistString(plistPath, key, value) {
  const replace = spawnSync("plutil", ["-replace", key, "-string", value, plistPath], {
    encoding: "utf8",
  });
  if (replace.status === 0) {
    return;
  }

  const insert = spawnSync("plutil", ["-insert", key, "-string", value, plistPath], {
    encoding: "utf8",
  });
  if (insert.status === 0) {
    return;
  }

  const details = [replace.stderr, insert.stderr].filter(Boolean).join("\n").trim();
  fail(`Failed to set plist key ${key} at ${plistPath}${details ? `:\n${details}` : ""}`);
}

requireExecutable(t1codeBinPath, "t1code binary");
if (!existsSync(ghosttyAppPath)) {
  fail(`Ghostty.app not found at ${ghosttyAppPath}`);
}
if (!existsSync(ghosttyIconPath)) {
  fail(`Ghostty icon not found at ${ghosttyIconPath}`);
}

mkdirSync(launcherDir, { recursive: true });
rmSync(launcherAppPath, { recursive: true, force: true });

const tempDir = mkdtempSync(path.join(os.tmpdir(), "t1code-launcher-"));
const sourcePath = path.join(tempDir, "launcher.applescript");

const source = [
  `set repoPath to ${appleScriptString(repoRoot)}`,
  `set t1codeBinPath to ${appleScriptString(t1codeBinPath)}`,
  `set bunBinDir to ${appleScriptString(bunBinDir)}`,
  'set shellCommand to "export PATH=" & quoted form of bunBinDir & ":$PATH; cd " & quoted form of repoPath & "; exec " & quoted form of t1codeBinPath',
  'set launchCommand to "/bin/zsh -lc " & quoted form of shellCommand',
  'tell application id "com.mitchellh.ghostty"',
  "  activate",
  "  new window with configuration {command:launchCommand, initial working directory:repoPath, wait after command:true}",
  "end tell",
].join("\n");

writeFileSync(sourcePath, source, "utf8");
run("osacompile", ["-o", launcherAppPath, sourcePath]);

const infoPlistPath = path.join(launcherAppPath, "Contents", "Info.plist");
setPlistString(infoPlistPath, "CFBundleDisplayName", appName);
setPlistString(infoPlistPath, "CFBundleName", appName);
setPlistString(infoPlistPath, "CFBundleIdentifier", bundleId);

const resourcesDir = path.join(launcherAppPath, "Contents", "Resources");
copyFileSync(ghosttyIconPath, path.join(resourcesDir, "applet.icns"));

process.stdout.write(`Built Ghostty launcher app at ${launcherAppPath}\n`);
