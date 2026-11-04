#!/bin/bash
# ============================================================
# Build entry point (guide 15.1 / 4.2.4)
#   Output: build/output/<appid>_<platform>.deb
#   The file name carries **no version**; the version lives in the GitHub
#   Release tag.
#
# The actual build logic is tools/build_deb.py -- pure Python, no dpkg-deb
# dependency, so a real .deb can be produced and structurally self-checked even
# on a Windows development machine.
# ============================================================
set -euo pipefail

cd "$(dirname "$0")"

PLATFORM="${1:-x86_64}"

PY="$(command -v python3 || command -v python || true)"
if [ -z "${PY}" ]; then
    echo "ERROR: python3 is required to build" >&2
    exit 1
fi

exec "${PY}" tools/build_deb.py "${PLATFORM}"
