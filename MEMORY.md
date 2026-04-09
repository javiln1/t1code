# MEMORY

## 2026-04-09

- Fork created at `https://github.com/javiln1/t1code`.
- Local clone created at `/Users/javilopez/Projects/t1code`.
- Remotes configured:
  - `origin` -> `https://github.com/javiln1/t1code.git`
  - `upstream` -> `https://github.com/maria-rcks/t1code.git`
  - `t3-upstream` -> `https://github.com/pingdotgg/t3code.git`
- Sync automation will target `maria-rcks/t1code` directly and treat `pingdotgg/t3code` as a monitored upstream, not an auto-merge upstream.
- Local verification completed:
  - `bun fmt` passed
  - `bun lint` passed with 4 pre-existing warnings in `packages/client-core/src/wsTransport.ts`
  - `bun typecheck` passed
- Pushed commit `98d1a39` to `origin/main`.
- GitHub Actions workflows confirmed active:
  - `.github/workflows/sync-upstream.yml`
  - `.github/workflows/watch-t3code-releases.yml`
- Additional local run verification completed:
  - `T1CODE_HEADLESS=1 bun run apps/tui/src/index.tsx` passed and wrote a headless frame.
  - `bun build:tui` passed.
  - `T1CODE_HEADLESS=1 bun apps/tui/bin/t1code.js` passed and wrote a headless frame.
  - Global install from `apps/tui/maria_rcks-t1code-0.0.21.tgz` succeeded.
  - `t1code` on PATH passed a headless startup check.
- Local run artifacts currently present and untracked:
  - `.tmp/`
  - `apps/tui/maria_rcks-t1code-0.0.21.tgz`
