# Changelog

## 1.7.5

- F7/F5: the route never redirects to the TOS shell. A per-app auth endpoint
  (`dsh-authz.service`, loopback :18146) verifies the session through the
  platform access-control service when present and through the platform
  session-state endpoint otherwise. Failures render a local service page and
  return 403 instead of 500 or a redirect.
- V6: `BINARY-DECLARATION.md` + `BINARY-MANIFEST.json` register every native
  binary (9) with SHA-256, origin, version and license; the arm64 `node-pty`
  prebuild is removed from the amd64 package.
- F11: the store description states that uninstalling keeps the data directory
  and the `dsh-user` account, and how to remove them.
- S6: `X-Dsh-Gate` is a per-install random secret compared with
  `timingSafeEqual`; the fixed `1` is gone.
- Packaging fix: `plugin/` is now taken from the source tree (1.7.4 shipped a
  stale copy, which kept the fixed gate value alive).

## 1.7.4

- Per-app auth endpoint replaces the TOS-internal socket; binary manifest added;
  `undici.bak` removed; per-install gate secret.

## 1.7.3

- Removed ASCII semicolons from `.lang` (the store parser truncated values at
  the first `;`).

## 1.7.2

- Localized release notes; version bump.

## 1.7.1

- TOS session sign-in for the web UI, undici 8.12.2 / zod 4.6.7, prebuild and
  musl pruning, `webui.bz2`, beta flag off, token redaction, Usage & balance
  sidecar.
