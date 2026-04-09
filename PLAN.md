# PLAN

- [x] Fork `maria-rcks/t1code` into `javiln1/t1code`.
- [x] Clone the fork locally to `/Users/javilopez/Projects/t1code`.
- [x] Confirm local remotes for `origin` and `upstream`.
- [x] Add scheduled GitHub Actions automation for upstream sync PRs.
- [x] Add scheduled GitHub Actions monitoring for new `pingdotgg/t3code` releases.
- [x] Verify install, lint, and typecheck flow locally.
- [x] Push automation changes to `origin/main`.
- [x] Verify direct source-mode TUI startup in headless mode.
- [x] Verify built binary startup in headless mode.
- [x] Install a global `t1` / `t1code` command from a package tarball built from this fork.
- [x] Add a one-command local refresh flow for rebuilding and reinstalling the global `t1code` command.
- [x] Add a tracked Ghostty launcher builder to the repo.
- [x] Build a local `~/Applications/T1Code.app` launcher for one-click opening.
- [x] Verify launcher build plus repo fmt/lint/typecheck after adding it.
- [ ] Implement Codex-style steering/queuing in the TUI flow.
- [ ] Add slash-command UX similar to Claude Code, including visible command discovery.
- [ ] Add skills/MCP/context-oriented slash commands on top of the slash-command system.
