# RESEARCH

## Upstream Topology

- `javiln1/t1code` is a GitHub fork of `maria-rcks/t1code`.
- `maria-rcks/t1code` is based on `pingdotgg/t3code`, but it is not a direct GitHub fork of `pingdotgg/t3code`.
- Because of that fork topology, it is safe to automate syncs from `maria-rcks/t1code`, but it is not safe to blindly auto-merge `pingdotgg/t3code` into this repo.

## What Not To Do

- Do not force-push `main` from automation. This repo is intended to diverge over time with local customizations.
- Do not auto-merge `pingdotgg/t3code` directly into `main`. TUI-specific changes can make that unsafe or conflict-prone.
- Do not depend on a machine-local cron for upstream syncing if GitHub Actions can do the same job server-side.

## Chosen Strategy

- Use a scheduled GitHub Actions workflow to create or update a PR that merges `maria-rcks/t1code` into this fork.
- Use a separate scheduled workflow to open an issue when a new `pingdotgg/t3code` release appears upstream.
- Keep local customization work on `main` or feature branches, then review upstream sync PRs as they arrive.

## Codex Steering Findings

- OpenAI's open-source Codex repo exposes a real app-server RPC for same-turn steering: `turn/steer`.
- The relevant upstream implementation lives in:
  - `codex-rs/app-server/src/codex_message_processor.rs`
  - `sdk/python/src/codex_app_server/client.py`
  - `docs/tui-chat-composer.md`
- Codex distinguishes between:
  - immediate same-turn steering via `turn/steer`
  - queued follow-ups that wait until the current turn settles
  - rejected steers for non-steerable turn kinds like review/compact
- `t1code` originally only wired `turn/start` and `turn/interrupt` through its provider/orchestration layer, so deeper parity required adding a distinct steer command/event path instead of overloading turn start.

## Steering Guardrails

- Do not fake "real steering" by only changing TUI keybindings. Codex parity needs a separate provider call, not just queue plus interrupt behavior.
- Do not assume all providers support same-turn steering. Codex does; the Claude adapter in this repo does not.

## Slash Command Findings

- `t1code` already had the command registry, parsing, and matching logic in `packages/client-core/src/slashCommands.ts`.
- The missing parity surface was in the TUI:
  - no visible `/` command popup
  - no keyboard navigation over command matches
  - no command-template insertion flow before submit
- Codex's open-source TUI keeps the registry/filtering and the popup in sync:
  - `codex-rs/tui/src/slash_command.rs`
  - `codex-rs/tui/src/bottom_pane/slash_commands.rs`
  - `codex-rs/tui/src/bottom_pane/command_popup.rs`
- For this fork, the right move was to reuse the existing shared slash registry and add a TUI picker on top, rather than duplicating command definitions in `apps/tui`.

## TUI Runtime Guardrail

- Do not use `useEffectEvent` in this TUI until `@opentui/react` / `react-reconciler` is upgraded to a runtime that supports it.
- In the current stack, `useEffectEvent` compiles but crashes both source and packaged startup with `resolveDispatcher(...).useEffectEvent is not a function`.
