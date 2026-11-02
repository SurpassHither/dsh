# Privacy Policy

**Applies to**: 1.5.0 · Last updated: 2026-10-27

**DSH for TOS** (app ID: `dsh`)

> This app is an unofficial TerraMaster package of DeepSeek Harness (DSH), not an
> official DeepSeek product. This policy describes how **this package** handles data on
> TOS. DSH upstream behavior is governed by its own repository documentation.

Public URL: <https://github.com/SurpassHither/dsh/blob/main/PRIVACY.md>

## 1. Data collected

**The app itself collects and uploads nothing to any third party.** Specifically:

| Data | Where it lives | Notes |
|---|---|---|
| Session records and message history | `/Volume*/@apps/dsh/data/dsh/sessions/` | Your conversations with the model, stored locally only |
| Workspace selection and index | `/Volume*/@apps/dsh/data/dsh/workspaces/` | Directory paths you selected |
| Model API key and endpoint | `/Volume*/@apps/dsh/data/dsh/.credentials.yaml` (mode 600) | Entered by you, read locally only |
| Application logs | `/Volume*/@apps/dsh/data/dsh/` and journald | For troubleshooting; no conversation bodies |
| Browser local storage | Your browser | UI preferences (theme, language, panel state) |

The app does **not** collect visitor IPs, device fingerprints, usage statistics,
telemetry, or file-content listings.

## 2. Retention period

Data is **kept until you delete it**:

- Sessions: deleting a session in the UI removes its files immediately
- Workspaces: removing a workspace removes the index entry, not your actual files
- Uninstalling (`dpkg -r`): all data on the data volume is **kept**
- `dpkg -P` (purge): removes the system-disk fallback and the account; **data on the
  data volume is still kept** and must be deleted manually

There is no automatic expiration; the storage limit is your data volume's capacity.

## 3. Third-party sharing and data location

- The only data egress is **the model service you configure** (DeepSeek API by default,
  or a compatible endpoint). Prompts, context and the contents of files you select are
  sent to that service and are subject to its terms and privacy policy.
- This app sends **no** data to TerraMaster, to DeepSeek as the app publisher, or to
  anyone else.
- All local data stays on your TNAS data volume and **never leaves the device** except
  for the model calls described above.
- Transport uses HTTPS to the endpoint you configure.

## 4. Security measures

- Runs as the dedicated non-root account `dsh-user` with a systemd sandbox:
  `ProtectSystem=full`, `ProtectHome=read-only`, `NoNewPrivileges`, `PrivateDevices`,
  `RestrictSUIDSGID`
- Listens only on `127.0.0.1:18142`, reachable through the TOS nginx `/dsh/` route
- Credential files are mode 600 and owned by the app account; they are never written
  into the installation directory
- Working directories must be selected explicitly in the UI; otherwise no other shared
  folder is accessed
- ⚠️ To make the reverse-proxied page work, this package disables DSH's browser session
  check (token→cookie) and relies on TOS platform login and access control. Never expose
  port 18142 to the internet.

## 5. User rights

At any time you can: view data (data-volume directory), export sessions (from the UI),
correct settings (from the UI), delete a single session or workspace (from the UI), or
delete everything (remove the data directory).

## 6. Deletion channel

```bash
# Single session/workspace: delete in the UI
# All local data (irreversible):
rm -rf /Volume1/@apps/dsh/data
# Uninstall the app (keeps data):
dpkg -r dsh
# Full uninstall (also removes the system-disk fallback):
dpkg -P dsh
```

## 7. Contact

- Questions and data requests: <https://github.com/SurpassHither/dsh/issues>
- Upstream project: <https://github.com/deepseek-ai/deepseek-harness>

## 8. App-specific notes

- **Office preview and voice input are optional components** and are not loaded unless
  installed or used
- **Model calls are implemented by DSH upstream**: it sends session context to the model
  endpoint you configure; see its documentation for details
- **No API key is bundled**: you must enter your own on first use; the key stays local
