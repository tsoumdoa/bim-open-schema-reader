# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Single **Next.js 16** app (`bos-reader`): a browser-only BIM Open Schema (`.bos`) reader powered by **DuckDB-Wasm**. There is no backend API, database, or Docker stack—only the Next.js dev/production server and a modern browser.

### Services

| Service | Required? | How to run |
|---------|-----------|------------|
| Next.js dev server | Yes | `pnpm dev` → http://localhost:3000 |
| Browser (Web Workers + WebGL) | Yes | For real E2E / manual testing |
| jsDelivr CDN | Yes (runtime) | DuckDB-Wasm worker bundles (see `src/app/hooks/use-duckdb.ts`) |
| Demo sample host | Optional | `https://rschema-reader-demo.tzero.one/sample.bos` for “Try with a sample BIM file” |

Use **tmux** for long-running `pnpm dev` (e.g. session `next-dev-server`).

### Commands (see `package.json`)

- **Install:** `pnpm install` (prefer pnpm; `pnpm-lock.yaml` is canonical; `package-lock.json` also exists)
- **Dev:** `pnpm dev` (`next dev --turbopack`)
- **Lint:** `pnpm lint`
- **Format:** `pnpm format:check` / `pnpm format:write`
- **Build:** `pnpm build` (may fail TypeScript check on `main`—dev server still runs)
- **Tests:** none configured (no `test` script)

### Hello-world smoke (core flow)

1. `pnpm dev`, open http://localhost:3000
2. Click **Try with a sample BIM file**, then **Process**
3. Wait for DuckDB + parquet load (needs outbound HTTPS to jsDelivr)
4. Run a preset query (e.g. **Materials Basic Info**) and confirm table results

No `.bos` fixtures are committed; use the sample button or provide a local `.bos` upload.

### Gotchas

- **No `.env`** — nothing to configure for local dev.
- **`pnpm format:check`** can fail on `raycast-picker.tsx` because Prettier’s SQL plugin chokes on embedded DuckDB-style SQL (`::text`); this is a known repo issue, not a missing dependency.
- **`pnpm lint`** currently fails on `prefer-const` in `src/lib/geometry-utils.ts` (plus warnings elsewhere).
- **`pnpm build`** may fail TypeScript on `viewer-overlay.tsx` (`zoomTrigger` prop); dev mode still serves the app.
- Offline/air-gapped VMs need a mirror for jsDelivr DuckDB assets or code changes in `use-duckdb.ts`.
