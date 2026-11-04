#!/bin/bash
# DSH for TOS -- startup wrapper
#
# Why this wrapper exists: systemd ExecStart only expands ${VAR}, while
# --trusted-host must be repeated once per host from the environment; a single
# variable cannot be split into multiple arguments. We assemble the argv here
# with set --.
#
# It also strips the `?token=...` URL that DSH prints on startup from the logs
# (review item F10).
set -eu
set -o pipefail

APP_DIR=/usr/local/dsh
: "${DSH_HOME:=/var/lib/dsh/dsh}"
: "${DSH_PORT:=18142}"
: "${DSH_TRUSTED_HOSTS:=}"

export DSH_HOME
export HOME="${HOME:-/var/lib/dsh}"
export NODE_ENV=production
# Silence Node telemetry noise (DSH collects nothing; this only keeps logs clean)
export NEXT_TELEMETRY_DISABLED=1

set -- "$APP_DIR/app/node_modules/@deepseek-ai/dsh/lib/bin.js" web \
       --no-open --host 127.0.0.1 --port "$DSH_PORT"

for host in $DSH_TRUSTED_HOSTS; do
    [ -n "$host" ] || continue
    set -- "$@" --trusted-host "$host"
done

# The token must never reach the journal: redact it at the output layer
"$APP_DIR/bin/node" "$@" 2>&1 \
    | sed -u -E 's/([?&]token=)[^ &]+/\1REDACTED/g'
exit ${PIPESTATUS[0]}
