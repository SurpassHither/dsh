#!/bin/sh
# ============================================================
# DSH for TOS -- optional component: Office document preview (docx / pptx)
#
# Why it is not bundled: this component is 146 MB unpacked (~46 MB
# compressed). Users who only work with plain text or code never need it, and
# bundling it would add 46 MB to every download and waste App Center bandwidth.
# It is fetched on demand instead.
#
# Usage (requires root):
#   sudo /usr/local/dsh/bin/install-office-preview.sh           # install/update
#   sudo /usr/local/dsh/bin/install-office-preview.sh --remove  # remove
#   sudo /usr/local/dsh/bin/install-office-preview.sh --check   # status only
#
# Network: tries npmmirror first, then falls back to the official npm registry.
# ============================================================
set -eu

VERSION="0.1.5"
PKG="@deepseek-ai/libreoffice-kit-wasm"
APP_DIR=/usr/local/dsh
DEST="$APP_DIR/app/node_modules/@deepseek-ai/libreoffice-kit-wasm"
TMP="$(mktemp -d /tmp/dsh-office.XXXXXX)"
trap 'rm -rf "$TMP"' EXIT

MIRRORS="
https://registry.npmmirror.com/$PKG/-/libreoffice-kit-wasm-$VERSION.tgz
https://registry.npmjs.org/$PKG/-/libreoffice-kit-wasm-$VERSION.tgz
"

status() {
    if [ -f "$DEST/package.json" ]; then
        echo "Office preview: installed ($(python3 -c "import json;print(json.load(open('$DEST/package.json'))['version'])" 2>/dev/null || echo unknown))"
        return 0
    fi
    echo "Office preview: not installed (docx/pptx will report 'Office previews are unavailable')"
    return 1
}

case "${1:-install}" in
    --check|check)
        status
        exit 0
        ;;
    --remove|remove|uninstall)
        if [ -d "$DEST" ]; then
            rm -rf "$DEST"
            echo "Removed the Office preview component, restarting the service..."
            systemctl restart dsh 2>/dev/null || true
            echo "Done. docx/pptx preview is no longer available; other features are unaffected."
        else
            echo "Not installed, nothing to remove."
        fi
        exit 0
        ;;
    install|--install)
        ;;
    *)
        echo "Usage: $0 [install|--remove|--check]" >&2
        exit 2
        ;;
esac

if [ "$(id -u)" != "0" ]; then
    echo "Root is required: please use sudo $0" >&2
    exit 1
fi

echo "Downloading $PKG@$VERSION (~46 MB)..."
ok=0
for url in $MIRRORS; do
    echo "  trying: $url"
    if curl -fsSL --retry 2 --connect-timeout 15 -o "$TMP/pkg.tgz" "$url"; then
        ok=1
        break
    fi
done
if [ "$ok" != "1" ]; then
    cat >&2 <<'EOF'
Download failed. Likely causes:
  - This NAS has no internet access (offline install): Office preview needs a
    one-time download; every other feature keeps working.
  - DNS / firewall blocked registry.npmmirror.com or registry.npmjs.org.
You can download and install it manually:
  curl -L -o /tmp/kit.tgz https://registry.npmmirror.com/@deepseek-ai/libreoffice-kit-wasm/-/libreoffice-kit-wasm-0.1.5.tgz
  sudo tar xzf /tmp/kit.tgz -C /usr/local/dsh/app/node_modules/@deepseek-ai/ --one-top-level=libreoffice-kit-wasm --strip-components=1
  sudo systemctl restart dsh
EOF
    exit 1
fi

echo "Extracting to $DEST ..."
rm -rf "$DEST"
mkdir -p "$DEST"
tar xzf "$TMP/pkg.tgz" -C "$DEST" --strip-components=1

if [ ! -f "$DEST/package.json" ]; then
    echo "package.json missing after extraction; install failed" >&2
    rm -rf "$DEST"
    exit 1
fi

chown -R root:root "$DEST" 2>/dev/null || true
chmod -R a+rX "$DEST" 2>/dev/null || true

echo "Restarting the service to load the component..."
systemctl restart dsh 2>/dev/null || true
sleep 3
systemctl is-active dsh >/dev/null 2>&1 && echo "Service restarted." || echo "Service did not start, check journalctl -u dsh" >&2

status
echo
echo "You can now open docx/pptx previews in the app."
echo "Remove with: sudo $0 --remove"
