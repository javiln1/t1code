import { describe, expect, it } from "vitest";

import {
  enqueueQueuedComposerSubmission,
  pruneQueuedComposerSubmissions,
  shiftQueuedComposerSubmission,
  type QueuedComposerSubmissionMap,
} from "./composerQueue";

type TestQueueMap = QueuedComposerSubmissionMap<string, string>;

function makeSubmission(label: string) {
  return {
    text: label,
    mentions: [label],
    attachments: [label],
    provider: "codex" as const,
    model: "gpt-5-codex",
    modelOptions: undefined,
    runtimeMode: "full-access" as const,
    interactionMode: "default" as const,
    queuedAt: `2026-04-10T00:00:0${label}.000Z`,
  };
}

describe("enqueueQueuedComposerSubmission", () => {
  it("appends queued submissions in order for a thread", () => {
    let state: TestQueueMap = {};
    state = enqueueQueuedComposerSubmission(state, "thread-1", makeSubmission("1"));
    state = enqueueQueuedComposerSubmission(state, "thread-1", makeSubmission("2"));

    expect(state["thread-1"]?.map((entry) => entry.text)).toEqual(["1", "2"]);
  });
});

describe("shiftQueuedComposerSubmission", () => {
  it("returns the next queued submission and removes it from the thread queue", () => {
    const state = enqueueQueuedComposerSubmission(
      enqueueQueuedComposerSubmission({}, "thread-1", makeSubmission("1")),
      "thread-1",
      makeSubmission("2"),
    );

    const first = shiftQueuedComposerSubmission(state, "thread-1");
    expect(first.submission?.text).toBe("1");
    expect(first.next["thread-1"]?.map((entry) => entry.text)).toEqual(["2"]);

    const second = shiftQueuedComposerSubmission(first.next, "thread-1");
    expect(second.submission?.text).toBe("2");
    expect(second.next["thread-1"]).toBeUndefined();
  });
});

describe("pruneQueuedComposerSubmissions", () => {
  it("removes queues for threads that no longer exist", () => {
    const state = enqueueQueuedComposerSubmission(
      enqueueQueuedComposerSubmission({}, "thread-1", makeSubmission("1")),
      "thread-2",
      makeSubmission("2"),
    );

    expect(pruneQueuedComposerSubmissions(state, new Set(["thread-2"]))).toEqual({
      "thread-2": [makeSubmission("2")],
    });
  });
});
