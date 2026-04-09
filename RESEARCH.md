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
