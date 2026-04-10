import type {
  ProviderInteractionMode,
  ProviderKind,
  ProviderModelOptions,
  RuntimeMode,
} from "@t3tools/contracts";

export type QueuedComposerSubmission<TMention, TAttachment> = {
  text: string;
  mentions: readonly TMention[];
  attachments: readonly TAttachment[];
  provider: ProviderKind;
  model: string;
  modelOptions: ProviderModelOptions | undefined;
  runtimeMode: RuntimeMode;
  interactionMode: ProviderInteractionMode;
  queuedAt: string;
};

export type QueuedComposerSubmissionMap<TMention, TAttachment> = Readonly<
  Record<string, readonly QueuedComposerSubmission<TMention, TAttachment>[]>
>;

export function enqueueQueuedComposerSubmission<TMention, TAttachment>(
  current: QueuedComposerSubmissionMap<TMention, TAttachment>,
  threadId: string,
  submission: QueuedComposerSubmission<TMention, TAttachment>,
): QueuedComposerSubmissionMap<TMention, TAttachment> {
  return {
    ...current,
    [threadId]: [...(current[threadId] ?? []), submission],
  };
}

export function shiftQueuedComposerSubmission<TMention, TAttachment>(
  current: QueuedComposerSubmissionMap<TMention, TAttachment>,
  threadId: string,
): {
  next: QueuedComposerSubmissionMap<TMention, TAttachment>;
  submission: QueuedComposerSubmission<TMention, TAttachment> | null;
} {
  const existing = current[threadId] ?? [];
  const submission = existing[0] ?? null;
  if (!submission) {
    return { next: current, submission: null };
  }

  const remaining = existing.slice(1);
  if (remaining.length === 0) {
    const { [threadId]: _, ...rest } = current;
    return { next: rest, submission };
  }

  return {
    next: {
      ...current,
      [threadId]: remaining,
    },
    submission,
  };
}

export function pruneQueuedComposerSubmissions<TMention, TAttachment>(
  current: QueuedComposerSubmissionMap<TMention, TAttachment>,
  liveThreadIds: ReadonlySet<string>,
): QueuedComposerSubmissionMap<TMention, TAttachment> {
  let changed = false;
  const next: Record<string, readonly QueuedComposerSubmission<TMention, TAttachment>[]> = {};

  for (const [threadId, submissions] of Object.entries(current)) {
    if (!liveThreadIds.has(threadId) || submissions.length === 0) {
      changed = true;
      continue;
    }
    next[threadId] = submissions;
  }

  return changed ? next : current;
}
