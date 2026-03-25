import { describe, expect, it } from "vitest";

import {
  KEYBINDING_GUIDE_SECTIONS,
  shouldClearComposerOnCtrlC,
  shouldOpenQuitPromptOnEscape,
} from "./keyboardBehavior";

describe("keyboardBehavior", () => {
  it("opens the quit prompt on escape when nothing dismissible is open", () => {
    expect(
      shouldOpenQuitPromptOnEscape({
        keyName: "escape",
        hasDismissibleLayer: false,
      }),
    ).toBe(true);
  });

  it("does not open the quit prompt while escape should dismiss another layer", () => {
    expect(
      shouldOpenQuitPromptOnEscape({
        keyName: "escape",
        hasDismissibleLayer: true,
      }),
    ).toBe(false);
  });

  it("treats ctrl-c as the composer clear shortcut", () => {
    expect(
      shouldClearComposerOnCtrlC({
        keyName: "c",
        ctrl: true,
      }),
    ).toBe(true);
  });

  it("documents the updated escape quit flow and ctrl-c composer clear shortcut", () => {
    const globalSection = KEYBINDING_GUIDE_SECTIONS.find((section) => section.title === "Global");
    const composerSection = KEYBINDING_GUIDE_SECTIONS.find(
      (section) => section.title === "Composer",
    );

    expect(globalSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "Esc",
        action:
          "Close the active dialog, overlay, or image preview; otherwise open the quit prompt",
      }),
    );
    expect(globalSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "Esc / Enter",
        action: "Confirm quit from the exit prompt",
      }),
    );
    expect(composerSection?.items).toContainEqual(
      expect.objectContaining({
        shortcut: "Ctrl+C",
        action: "Clear the current draft",
      }),
    );
  });
});
