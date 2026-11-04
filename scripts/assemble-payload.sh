#!/bin/bash
# ============================================================================
# Assemble the payload: Node runtime + DSH app + DSH profile seed
# ----------------------------------------------------------------------------
# Run on a build host (test machine or CI) to produce app/payload/, which
# tools/build_deb.py then packages.
#
# Size policy:
#   · Office preview engine (libreoffice-kit-wasm, 146MB unpacked / 46MB
#     compressed) is **not bundled**; users can fetch it on demand with
#     bin/install-office-preview.sh (npmmirror by default).
#   · Local speech input (sherpa-onnx, ~32MB) **is bundled**: since 1.1.0 the
#     web UI has a voice entry point and the mobile client relies on it for
#     local recognition. tokens.txt / silero_vad.onnx are bundled too (~2MB);
#     the 239MB recognition model is still downloaded by DSH on first use.
#
# Usage:
#   DSH_RUNTIME=/opt/dsh-runtime DSH_PROFILE=$HOME/.dsh/profiles/web \
#       bash scripts/assemble-payload.sh
# ============================================================================
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUNTIME="${DSH_RUNTIME:-/opt/dsh-runtime}"
PROFILE_SRC="${DSH_PROFILE:-$HOME/.dsh/profiles/web}"
OUT="${APP_DIR}/payload"

echo "=== assembling ${OUT} ==="
rm -rf "${OUT}"
mkdir -p "${OUT}/bin" "${OUT}/app" "${OUT}/profile-seed/profiles"

# ---- Node runtime: ship only the node binary (no npm/headers, saves ~150MB) ----
cp "${RUNTIME}/node/bin/node" "${OUT}/bin/node"
for script in start-dsh.sh grant-share.sh install-office-preview.sh usage-service.py tos-authz.py; do
    cp "${APP_DIR}/scripts/${script}" "${OUT}/bin/${script}"
done
chmod 755 "${OUT}/bin/node" "${OUT}/bin/start-dsh.sh" \
          "${OUT}/bin/grant-share.sh" "${OUT}/bin/install-office-preview.sh"
chmod 644 "${OUT}/bin/usage-service.py" "${OUT}/bin/tos-authz.py"

# ---- DSH application ----
cp "${RUNTIME}/app/package.json" "${OUT}/app/package.json"
cp -a "${RUNTIME}/app/node_modules" "${OUT}/app/node_modules"

# ---- Remove optional components from the default bundle ----
# Office preview: downloaded on demand so every user does not pay 46MB.
rm -rf "${OUT}/app/node_modules/@deepseek-ai/libreoffice-kit-wasm"

# Speech input: the sherpa-onnx Linux x64 native package must be kept.
if [ ! -d "${OUT}/app/node_modules/sherpa-onnx-linux-x64" ]; then
    echo "WARN: sherpa-onnx-linux-x64 is missing from the runtime; speech input will be unavailable." >&2
    echo "      On the build host run: cd ${RUNTIME}/app && npm install --no-save sherpa-onnx-linux-x64@1.13.8" >&2
fi
# Small tokens/VAD assets ship with the package to avoid first-run download timeouts.
if [ -d "${APP_DIR}/voice-assets" ]; then
    cp -a "${APP_DIR}/voice-assets" "${OUT}/voice-assets"
fi

# ---- Sidebar shell plugin (workspace groups + blue running indicator) ----
if [ -d "${APP_DIR}/plugin" ]; then
    mkdir -p "${OUT}/plugin"
    cp -a "${APP_DIR}/plugin/." "${OUT}/plugin/"
fi

# ---- DSH profile seed (TOS gate plugin + shell UI) ----
cp -a "${PROFILE_SRC}" "${OUT}/profile-seed/profiles/web"
rm -rf "${OUT}/profile-seed/profiles/web/.plugin-manager"

# ---- Build info ----
NODE_V="$("${OUT}/bin/node" -v)"
DSH_V="$("${OUT}/bin/node" "${OUT}/app/node_modules/@deepseek-ai/dsh/lib/bin.js" --version 2>/dev/null | head -1 || true)"
SIZE="$(du -sh "${OUT}" | cut -f1)"
FILES="$(find "${OUT}" -type f | wc -l)"
cat > "${OUT}/BUILD-INFO.txt" <<EOF
DSH for TOS payload
===================
Node.js      : ${NODE_V}  (official Linux x64 tarball, npmmirror binary mirror)
dsh          : ${DSH_V:-unknown}  (@deepseek-ai/dsh, MIT, https://github.com/deepseek-ai/deepseek-harness)
Profile deps : @surpasshither/dsh-tos-gate (MIT) -- trusts nginx-injected X-Dsh-Gate only
               and marks the TOS route as a "local" page; Host/Origin fence stays on.
Optional     : @deepseek-ai/libreoffice-kit-wasm -- NOT bundled; install with
               /usr/local/dsh/bin/install-office-preview.sh (about 46MB, npmmirror first)
Voice        : sherpa-onnx-linux-x64 1.13.8 (Apache-2.0) + SenseVoiceSmall tokens/VAD assets.
               The 239MB model is downloaded on first use (HF-Mirror fallback).
Built at     : $(date -u +%Y-%m-%dT%H:%M:%SZ)
Built on     : $(uname -sr)
Size         : ${SIZE} (${FILES} files)
EOF

echo "=== done ==="
cat "${OUT}/BUILD-INFO.txt"
