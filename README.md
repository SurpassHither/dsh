# DSH for TOS

> **Unofficial build**
>
> This app is an unofficial TerraMaster TOS package of **DeepSeek Harness (DSH)**,
> packaged by SurpassHither. It is **not** an official DeepSeek product and is not
> endorsed by DeepSeek.
> Upstream: <https://github.com/deepseek-ai/deepseek-harness> (**MIT**, Copyright (c) 2026 DeepSeek).
> Following the upstream BRAND_GUIDELINES, the project name uses the recommended short
> form **DSH**; the full name is used only in descriptive text.
> "DeepSeek Harness" is a trademark of DeepSeek.

| Item | Value |
|---|---|
| Version | 1.5.0 |
| App ID | `dsh` |

This is version **1.5.0**.

DSH's web UI on TOS: after installation, open it from the TOS desktop and you get the
full interface (sessions, workspaces, plugins, settings). A fixed Node.js runtime is
bundled, so the **main app works offline after installation**. Add your own model API
key to start.

**Since 1.1.0, local voice input is built in** (SenseVoice / sherpa-onnx): the 239 MB
model is downloaded on first use, and audio is recognized on the NAS itself — never
uploaded.

## Features

- The original DSH web UI: sessions, workspaces, plugin market, model settings, tasks and tool calls
- Bundled Node.js (LTS); no runtime needs to be preinstalled on TOS
- Sessions, workspaces and long-term memory live on the data volume and survive upgrades
- Dedicated non-root account + systemd sandbox; reachable only through the TOS web route, no extra ports
- **Local voice input**: microphone → on-device SenseVoice → session draft; audio is never stored or uploaded
- **English UI by default**: switch languages in DSH Settings
- **Mobile app**: planned; the sidebar button currently opens a local "coming soon" page

## Languages

- **App Center listing**: `.lang` covers the **23 languages** TOS supports (including
  Arabic and Hebrew): `zh-cn zh-hk en-us fr-fr de-de it-it es-es hu-hu ja-jp ko-kr
  pl-pl ru-ru tr-tr pt-pt ar-sa cs-cz he-il id-id nb-no nl-nl sv-se th-th vi-vn`.
- **In-app UI**: determined by DSH itself, which currently ships **English / Simplified
  Chinese** only. Follows the browser language, and can be changed in
  **Settings → General → Language**.
- **RTL (Arabic / Hebrew)**: upstream DSH has no RTL support. This package injects a
  small script at the nginx layer that marks the page `dir="rtl"` and fixes form
  direction when the browser language is `ar` / `he` (also `fa` / `ur`). This is a
  best-effort layout adaptation; UI strings remain English/Chinese.

## Permissions

| Permission | Purpose | Notes |
|---|---|---|
| Data volume read/write (`/Volume*/@apps/dsh/data`) | Store sessions, workspaces and long-term memory | The only default writable location |
| User-granted working directories | The agent reads/writes the project folders you pick | Chosen in the UI; nothing is touched otherwise |
| Network (outbound) | Call the model API you configure; download the voice model on first use | Only your key and endpoint; no telemetry |
| Listen on 127.0.0.1:18142 | Used by TOS nginx / the future mobile app reverse proxy | Loopback only |
| Voice model cache (`data/dsh/speech-to-text/`) | Local SenseVoice recognition | About 240 MB; no recordings |

Not requested: root, privileged mode, host networking, kernel modules. The voice model
uses roughly 1 GB of memory when loaded; 4 GB of free NAS memory is recommended.

## Data safety

This app **never deletes shared folders**. Uninstalling (including purge) only removes
the app's own `/Volume*/@apps/dsh`; `/Volume*/DSH` and any other shared folder are left
untouched.

## Runtime write paths (guide 12.9.6)

> The paths below are created by this app at runtime. Column names follow the vendor guide.

| Path (relative to `/Volume*/@apps/dsh/data/` unless noted) | Purpose | Format | Created | Growth / rotation | Lifecycle |
|---|---|---|---|---|---|
| `dsh/profiles/web/` | DSH profile: plugin list and patch config | YAML/JSON | Seeded by postinst on first install | < 1 MB | Persistent; preserved on upgrade |
| `dsh/profiles/web/node_modules/` | Plugin packages (tailnet-admin and the bundled shell UI) | Directory | Seeded on first install | < 5 MB | Persistent |
| `dsh/sessions/` | Session records and message history | JSONL | On each new session | Grows with use; delete from the UI | Persistent; kept on uninstall |
| `dsh/.credentials.yaml` | Browser session signing secrets | YAML | First start | < 64 KB | Persistent; mode 600 |
| `dsh/workspaces/` | Workspace index and metadata | JSON | First workspace added | < 10 MB | Persistent |
| `dsh/speech-to-text/sensevoice/models/` | SenseVoice model, tokens and VAD | ONNX/TXT | First voice use / small files seeded at install | About 240 MB | Persistent; kept when the plugin is disabled |
| `workspace/` | Default working directory (can be changed to a shared folder) | Directory | First install | Depends on your files | Persistent |
| `/var/lib/dsh/` (system-disk fallback, only when no data volume exists) | Same as above, fallback location | Directory | When no data volume is available | As above | Kept on uninstall, removed on purge |

The app does **not** write to `/etc`, `/usr`, or the shared `/tmp`.

## Working directories and shared folders

- **Default workspace**: at install time the app creates (or reuses) the shared folder
  **`DSH`** at `/Volume1/DSH` (the first existing volume on multi-volume systems). The
  app account `dsh-user` owns it. If a folder with that name already exists, it is used
  **as is** and nothing inside is deleted.
- **Other shared folders**: the picker starts at `/Volume1/@apps/dsh/data/home`, which
  lists `workspace` (→ the DSH shared folder) plus `Volume1` / `Volume2` …, so you can
  browse into any other shared folder.
- **Access to other shared folders requires a grant**: TOS uses a private ACL; being in
  `allusers` is not enough. If the picker shows `EACCES / permission denied`, the app
  account has no permission on that folder yet. Open **TOS Control Panel → Shared
  Folders → select the folder → Edit → Permissions**, grant the app user **`dsh-user`**
  read-only or read-write access, save, then retry in the app. An admin can also run:

  ```bash
  sudo /usr/local/dsh/bin/grant-share.sh /Volume1/public rw   # read-write
  sudo /usr/local/dsh/bin/grant-share.sh /Volume1/public off  # revoke
  ```

- Only volume contents may be selected; picking a volume root itself (`/Volume1`) is
  rejected by the UI with a hint to choose a shared folder inside it.

## Privacy policy

See [PRIVACY.md](./PRIVACY.md) for the full text:
<https://github.com/SurpassHither/dsh/blob/main/PRIVACY.md>

In short: session content is sent only to the model service **you** configure; the app
collects no telemetry and uploads no file listings; data lives on the local data volume
and is kept on uninstall, removed on purge.

## Install

```bash
dpkg -i dsh_1.5.0_x86_64.deb
systemctl status dsh
```

Open it from **TOS desktop → DSH for TOS**, which opens `/dsh/` in a new tab.

## Uninstall

```bash
dpkg -r dsh     # keeps /Volume*/@apps/dsh/data
dpkg -P dsh     # also removes the system-disk fallback; data on the volume is still kept
```

## Security notes (please read)

DSH is a **coding agent**: it can execute model-generated commands and read/write the
working directories you grant. Upstream's `SAFETY.md` states it is experimental and has
not been security-audited. This package reduces the risk in three ways:

1. Runs as a dedicated non-root account with a systemd sandbox (`ProtectSystem=full`,
   `ProtectHome=read-only`, `NoNewPrivileges`)
2. Listens only on `127.0.0.1:18142`, reachable through the TOS nginx route, no extra ports
3. The default working directory is on the data volume; other shared folders are only
   accessed after you explicitly select them

⚠️ **The most important boundary**: to make the reverse-proxied page work, this package
disables DSH's **browser session check** (token→cookie) via
`@he0119/dsh-tailnet-admin`. Host/Origin checks remain enabled. **Anyone who can open
`/dsh/` can control this machine.** The TOS `/dsh/` route itself performs no login
(verified: unauthenticated requests return 200).

**A companion mobile app with local login + TOTP is planned.** Until it ships, access
`/dsh/` only from the NAS loopback or an SSH tunnel, and never map port 5449 or 18142
directly to the internet.

## Troubleshooting

```bash
journalctl -u dsh -n 100 --no-pager
cat /usr/local/dsh/dsh.env
ls /Volume1/@apps/dsh/data/dsh/
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:18142/   # should be 200
```

## Build

```bash
# On a build host (Ubuntu 22.04 / same glibc as TOS 7):
DSH_RUNTIME=/opt/dsh-runtime DSH_PROFILE=$HOME/.dsh/profiles/web \
    bash scripts/assemble-payload.sh
python3 tools/build_deb.py x86_64
```

## Office preview (optional, on demand)

docx / pptx preview needs a 146 MB WASM engine (46 MB compressed). It is **not** part of
the installation package, so users who do not need it do not download it. Install it
when needed:

```bash
sudo /usr/local/dsh/bin/install-office-preview.sh          # install (about 46 MB)
sudo /usr/local/dsh/bin/install-office-preview.sh --check  # check
sudo /usr/local/dsh/bin/install-office-preview.sh --remove # remove
```

- Downloads use **npmmirror** first and fall back to the official npm registry
- **Offline installs still work**: conversation, tools, terminal, files, and
  code/sheet/image previews are all available; only docx/pptx preview needs the one-time
  online install

## Known limitations

- `x86_64` only; Office preview must be installed on demand (see above)
- The voice model (239 MB) is downloaded on first use, with a Hugging Face mirror
  fallback. `tokens.txt` / `silero_vad.onnx` ship with the package. For a fully offline
  setup, place `model.int8.onnx` (239,233,841 bytes, SHA-256
  `c71f0ce00bec95b07744e116345e33d8cbbe08cef896382cf907bf4b51a2cd51`) under
  `data/dsh/speech-to-text/sensevoice/models/sensevoice-onnx/`
- The voice model uses roughly 1 GB of memory; disable the voice plugin on low-memory NAS
- DSH is a developer preview and upstream may make breaking changes; watch upstream
  releases when upgrading this app
- You must provide your own model API key (DeepSeek or a compatible endpoint)
- **DeepSeek account sign-in does not work behind a reverse proxy**: it requires a
  browser-reachable loopback callback, which the upstream protocol rejects when the page
  is opened through the NAS address. This build keeps the sign-in entry disabled and
  supports API keys only
- **`/dsh/` is not a login page**: it is a reverse-proxy route with no user
  authentication. Use an SSH tunnel, or wait for the companion mobile app

## License

- This package (build scripts, systemd unit, nginx config, documentation): **MIT**, see [LICENSE](./LICENSE)
- Upstream DSH: **MIT**, Copyright (c) 2026 DeepSeek, see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)
- Third-party dependencies and trademark notes: see [NOTICE](./NOTICE)
