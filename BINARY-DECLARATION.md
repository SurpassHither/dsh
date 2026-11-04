# Binary Declaration

Every native binary and every executable-bit file shipped in this package is listed
below with its SHA-256, origin, version and license. The same data is available in
machine-readable form in `BINARY-MANIFEST.json`.

Build provenance: `bin/node` comes from the official Node.js tarball
`node-v24.22.1-linux-x64.tar.xz`, whose published checksum
(<https://nodejs.org/dist/v24.22.1/SHASUMS256.txt>) is
`6c172a9ab6718f7b801fb5a7bd486af2ee5e32758086a04b84fcce2aa77095e6`; the shipped
file is the tarball's `bin/node` copied unmodified. The npm packages below are
installed from the public registry by `scripts/assemble-payload.sh` and pruned by
`tools/prune_payload.sh` (Windows/macOS prebuilds, musl variants, unused CLI entries,
duplicate `zod` copies and the non-matching-architecture `node-pty` prebuild are
removed). `tools/build_deb.py` packs the tree with fixed archive timestamps.

## Native binaries (9)

| Path (under `/usr/local/dsh/`) | SHA-256 | Origin | Version | License | Purpose |
|---|---|---|---|---|---|
| `bin/node` | `e32e2d16081cf644f88392934288086e7662529d0d43277c34f7aad2207cfafb` | Node.js official Linux x64 tarball | 24.22.1 | MIT | JavaScript runtime |
| `app/node_modules/@vscode/ripgrep-linux-x64/bin/rg` | `193906679498de4d939345b937fa24e0e69a03c244bd70c859f5e41232713f21` | npm package @vscode/ripgrep-linux-x64 | 1.18.0 | MIT | File search used by the agent |
| `app/node_modules/@deepseek-ai/node-addon-system-linux-x64/bin/landlock-run` | `a752bc72f111fcc573c3e61fb90fa544541dac0ca498d2e279e1630d7c659b31` | npm package @deepseek-ai/node-addon-system-linux-x64 | 0.1.2 | BSD-3-Clause | Landlock sandbox helper |
| `app/node_modules/@deepseek-ai/node-addon-system-linux-x64/bin/glibc/system.node` | `54a9c25c05186c17520f6b7a5ced5f005752c08044c3eb76524cd517287600bc` | npm package @deepseek-ai/node-addon-system-linux-x64 | 0.1.2 | BSD-3-Clause | Native system addon (glibc) |
| `app/node_modules/@img/sharp-linux-x64/lib/sharp-linux-x64-0.35.5.node` | `cf896cc1b7f3ae9c3e8eb3d7b2b198b8de2824ff7d0681d684bab5a825def335` | npm package @img/sharp-linux-x64 (sharp) | 0.35.5 | Apache-2.0 | Image decoding and resizing |
| `app/node_modules/@img/sharp-libvips-linux-x64/lib/libvips-cpp.so.8.18.7` | `4aa73553408c3964071728f4a231a8e86918e39bc49f1fbae75355f7ea933ea9` | npm package @img/sharp-libvips-linux-x64 (libvips) | 1.3.4 | LGPL-3.0-or-later | Image processing backend for sharp |
| `app/node_modules/@koromix/koffi-linux-x64/linux_x64/koffi.node` | `df687b8c68598c3ee83d06dcbc1d72fca032475e62b6108c4badfb5e43a3e7ff` | npm package @koromix/koffi-linux-x64 | 3.1.1 | MIT | FFI bridge used by native helpers |
| `app/node_modules/node-addon-require-builtin-linux-x64-gnu/prebuilt/linux-x64-gnu-napi-v9.node` | `40c34d27d8339e246a8f7415a06152935496cdc06555ea8fce0e052011acc70f` | npm package node-addon-require-builtin-linux-x64-gnu | 0.1.9 | MIT | Native helper for loading builtin modules |
| `app/node_modules/node-pty/prebuilds/linux-x64/pty.node` | `123792d8f22f36d519b21dfb6f4b716f9b18b9e579085ea2840d0773d88d35fd` | npm package node-pty | 1.2.0-beta.15 | MIT | Pseudo-terminal for the built-in terminal |

## Package scripts (4) — plain source, not compiled binaries

| Path | SHA-256 | Purpose |
|---|---|---|
| `bin/start-dsh.sh` | `f074a43b1e79ae7b6521970a79ad96f9180b02f05722eca1356318b34d139b6a` | Service entry point |
| `bin/grant-share.sh` | `bc22cc84a064f2834146c32384fb566d0888c18ca3b2be9a741afc8a8031e1c7` | Grant a shared folder to the app user |
| `bin/install-office-preview.sh` | `42718649d2154266c4b9e237201cdcecb484cffd4f805f44a3a599590979c18e` | Optional Office preview downloader |
| `bin/usage-service.py` | `862ba215599917809e41fe387428eba3417d3bf40da9b51a2df154a00ac65b17` | Usage and balance sidecar (Python standard library only) |

Files under `bin/` carry the executable bit by packaging convention; the two Python
files are started with `/usr/bin/python3`. The built `.deb` contains exactly these
13 files with the executable bit set.

Architecture note: this is the **x86_64 (amd64)** package. The arm64 `node-pty`
prebuild is removed at prune time, so no foreign-architecture binary is shipped here.
