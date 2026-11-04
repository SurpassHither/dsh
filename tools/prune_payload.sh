#!/bin/sh
# Prune the payload: drop platform prebuilds TOS never uses and collapse
# duplicate zod copies onto the top-level version.
# Shared by the x86_64 / aarch64 builds: tools/prune_payload.sh <payload dir>
set -eu

P="$1"
NM="$P/app/node_modules"
[ -d "$NM" ] || { echo "payload node_modules not found: $NM" >&2; exit 1; }

# 1) Windows / macOS prebuilds (never used on TOS) and the other architecture
rm -rf "$NM"/node-pty/prebuilds/win32-* \
       "$NM"/node-pty/prebuilds/darwin-* \
       "$NM"/node-pty/third_party
# Keep only the prebuild that matches the payload's own node binary (review item V6:
# an arm64 helper must not ship inside the amd64 package, and vice versa).
ARCH="${2:-x86_64}"
case "$ARCH" in
    x86_64)  rm -rf "$NM"/node-pty/prebuilds/linux-arm64 ;;
    aarch64) rm -rf "$NM"/node-pty/prebuilds/linux-x64 ;;
esac

# 2) musl variants (TOS is glibc)
rm -rf "$NM"/@deepseek-ai/node-addon-system-linux-*/bin/musl

# 3) CLI entry scripts not needed at runtime (package main modules are kept)
rm -rf "$NM"/@anthropic-ai/sdk/bin \
       "$NM"/js-yaml/bin \
       "$NM"/semver/bin \
       "$NM"/which/bin

# 4) Delete nested zod copies so require() falls back to the top-level 4.6.7
#    (review item T1)
TOP="$NM/zod"
if [ -f "$TOP/package.json" ]; then
    find "$NM" -path '*/node_modules/zod/package.json' | while IFS= read -r f; do
        d=$(dirname "$f")
        [ "$d" = "$TOP" ] && continue
        rm -rf "$d"
    done
fi

# 5) Seed profile: drop the legacy third-party tailnet-admin plugin (review item S4)
SEED="$P/profile-seed/profiles/web"
if [ -d "$SEED/node_modules" ]; then
    rm -rf "$SEED/node_modules/@he0119"
    if [ -f "$SEED/cordis.patch.yml" ]; then
        python3 - "$SEED/cordis.patch.yml" <<'PY'
import re
import sys

path = sys.argv[1]
text = open(path, encoding="utf-8").read()
text = re.sub(r"(?ms)^- id: tailnet-admin\n(?:.*\n)*?\s*disableBrowserAuth: true[ \t]*\n", "", text)
# leftover two-line Chinese header written by older postinst versions
text = re.sub("(?m)^# [^\n]*TOS[^\n]*\u672c\u673a[^\n]*\n", "", text)
text = re.sub("(?m)^# [^\n]*\u6d4f\u89c8\u5668\u4f1a\u8bdd\u6821\u9a8c[^\n]*\n", "", text)
open(path, "w", encoding="utf-8").write(text)
PY
    fi
    if [ -f "$SEED/package.json" ]; then
        python3 - "$SEED/package.json" <<'PY'
import json
import sys

path = sys.argv[1]
data = json.load(open(path, encoding="utf-8"))
deps = data.get("dependencies") or {}
deps.pop("@he0119/dsh-tailnet-admin", None)
data["dependencies"] = deps
json.dump(data, open(path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
PY
    fi
fi

echo "prune done: $(find "$P" -type f -perm -u+x 2>/dev/null | wc -l) executables"
