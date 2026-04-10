import { describe, expect, it } from "vitest";

import {
  KEYBINDING_GUIDE_SECTIONS,
  isCtrlC,
  shouldClearComposerOnCtrlC,
  shouldToggleComposerModeOnShiftTab,
} from "./keyboardBehavior";

describe("keyboardBehavior", () => {
  it("detects ctrl-c", () => {
    expect(
      isCtrlC({
        keyName: "c",
        ctrl: true,
      }),
    ).toBe(true);
  });

  it("treats ctrl-c as the composer clear shortcut when input handles it", () => {
    expect(
      shouldClearComposerOnCtrlC({
        keyName: "c",
        ctrl: true,
        composerFocused: true,
        hasComposerText: true,
      }),
    ).toBe(true);
  });

  it("does not clear the composer when it is not focused", () => {
    expect(
      shouldClearComposerOnCtrlC({
        keyName: "c",
        ctrl: true,
        composerFocused: false,
        hasComposerText: true,
      }),
    ).toBe(false);
  });

  it("does not clear the composer when the draft is empty", () => {
    expect(
      shouldClearComposerOnCtrlC({
        keyName: "c",
        ctrl: true,
        composerFocused: true,
        hasComposerText: false,
      }),
    ).toBe(false);
  });

  it("detects shift-tab for composer mode switching", () => {
    expect(
      shouldToggleComposerModeOnShiftTab({
        keyName: "tab",
        shift: true,
        composerFocused: true,
      }),
    ).toBe(true);
  });

  it("ignores non-composer or modified shift-tab presses", () => {
    expect(
      shouldToggleComposerModeOnShiftTab({
        keyName: "tab",
        shift: true,
        composerFocused: false,
      }),
    ).toBe(false);
    expect(
      shouldToggleComposerModeOnShiftTab({
        keyName: "tab",
        shift: true,
        ctrl: true,
        composerFocused: true,
      }),
    ).toBe(false);
  });

  it("documents the updated quit flow", () => {
    const globalSection = KEYBINDING_GUIDE_SECTIONS.find((section) => section.title === "Global");
    const composerSection = KEYBINDING_GUIDE_SECTIONS.find(
      (section) => section.title === "Composer",
    );

    expect(globalSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "Ctrl+C",
        action: "Open the quit prompt; press Ctrl+C again to confirm exit",
      }),
    );
    expect(globalSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "Esc",
        action: "Close the active dialog, overlay, or image preview",
      }),
    );
    expect(globalSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "Ctrl+C / Enter",
        action: "Confirm quit from the exit prompt",
      }),
    );
    expect(composerSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "Shift+Tab",
        action: "Toggle the composer between chat and plan mode",
      }),
    );
    expect(composerSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "Ctrl+C",
        action: "Clear the current draft",
      }),
    );
    expect(composerSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "/ then ↑ / ↓ / Enter",
        action: "Open the slash command picker and insert the selected command template",
      }),
    );
  });
});
