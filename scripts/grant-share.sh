#!/bin/sh
# ============================================================
# Grant the DSH application account access to a shared folder
#
# Why this is needed: TOS shared folders use a private ACL (btrfs
# system.tm_acl) that ignores POSIX groups -- adding dsh-user to allusers still
# cannot read /Volume1/public. The TOS-provided tmacltool must write the ACL
# entry itself.
#
# Usage (requires root):
#   sudo /usr/local/dsh/bin/grant-share.sh /Volume1/public        # read-write
#   sudo /usr/local/dsh/bin/grant-share.sh /Volume1/public ro     # read-only
#   sudo /usr/local/dsh/bin/grant-share.sh /Volume1/public off    # revoke
# ============================================================
set -eu

APPUSER=dsh-user
TARGET=${1:-}
MODE=${2:-rw}

if [ -z "$TARGET" ]; then
    echo "Usage: sudo $0 <shared-folder-path> [rw|ro|off]" >&2
    echo "Example: sudo $0 /Volume1/public" >&2
    exit 2
fi
if [ ! -d "$TARGET" ]; then
    echo "Directory does not exist: $TARGET" >&2
    exit 2
fi
if ! command -v tmacltool >/dev/null 2>&1; then
    echo "tmacltool not found -- this is not a TOS environment, cannot write TOS ACLs" >&2
    exit 3
fi

case "$MODE" in
    rw)  PERM='rwxpdDaARWc--' ;;
    ro)  PERM='r-x---a-R-c--' ;;
    off) PERM='' ;;
    *)   echo "Permission mode must be rw / ro / off" >&2; exit 2 ;;
esac

ENTRY="user:${APPUSER}:allow:${PERM}:fd--"

if [ "$MODE" = "off" ]; then
    tmacltool del "$TARGET" "$ENTRY" 2>/dev/null || true
    # del needs the full entry; try each known permission set in case it differs
    for p in 'rwxpdDaARWc--' 'r-x---a-R-c--'; do
        tmacltool del "$TARGET" "user:${APPUSER}:allow:${p}:fd--" 2>/dev/null || true
    done
    echo "Revoked ${APPUSER} access to ${TARGET}"
else
    tmacltool add "$TARGET" "$ENTRY"
    echo "Granted ${APPUSER} ${MODE} access to ${TARGET}"
fi

echo "--- current ACL ---"
tmacltool get "$TARGET" 2>/dev/null | head -10 || true
