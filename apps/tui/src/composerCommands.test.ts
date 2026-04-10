import { describe, expect, it } from "vitest";

import {
  applySlashCommandTemplate,
  parseApprovalResponseCommand,
  parseStandaloneComposerModeCommand,
} from "./composerCommands";

describe("parseStandaloneComposerModeCommand", () => {
  it("parses standalone /plan commands", () => {
    expect(parseStandaloneComposerModeCommand(" /plan ")).toBe("plan");
  });

  it("parses standalone /default commands", () => {
    expect(parseStandaloneComposerModeCommand("/default")).toBe("default");
  });

  it("ignores non-standalone mode commands", () => {
    expect(parseStandaloneComposerModeCommand("/plan refine this")).toBeNull();
  });
});

describe("parseApprovalResponseCommand", () => {
  it("parses supported approval decisions", () => {
    expect(parseApprovalResponseCommand("/approve accept")).toBe("accept");
    expect(parseApprovalResponseCommand("/approve accept-for-session")).toBe("acceptForSession");
    expect(parseApprovalResponseCommand("/approve decline")).toBe("decline");
    expect(parseApprovalResponseCommand("/approve cancel")).toBe("cancel");
  });

  it("ignores invalid approval commands", () => {
    expect(parseApprovalResponseCommand("/approve maybe")).toBeNull();
    expect(parseApprovalResponseCommand("approve accept")).toBeNull();
  });
});

describe("applySlashCommandTemplate", () => {
  it("replaces the active top-level slash query with the chosen template", () => {
    expect(applySlashCommandTemplate("/pr", "/project add ")).toBe("/project add ");
  });

  it("preserves leading whitespace and following lines", () => {
    expect(applySlashCommandTemplate("  /th\nsecond line", "/thread new ")).toBe(
      "  /thread new \nsecond line",
    );
  });

  it("falls back to the template when the existing text is not a top-level slash query", () => {
    expect(applySlashCommandTemplate("build this", "/help")).toBe("/help");
  });
});
