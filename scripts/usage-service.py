#!/usr/bin/env python3
"""Local usage/balance service for DSH for TOS.

Reads the DSH credential store (never leaves the NAS) and queries provider
balance endpoints where they exist. Currently: DeepSeek.
Listens on 127.0.0.1:18145; nginx exposes it under /dsh/usage behind the
same basic auth as the app.
"""
import json
import os
import re
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DSH_HOME = os.environ.get("DSH_HOME", "/var/lib/dsh/dsh")
CRED = os.path.join(DSH_HOME, ".credentials.yaml")
CACHE_TTL = 60
_cache = {"at": 0.0, "payload": None}


def read_refs():
    try:
        text = open(CRED, encoding="utf-8").read()
    except OSError:
        return {}
    refs = {}
    in_refs = False
    for line in text.splitlines():
        if re.match(r"^refs:\s*$", line):
            in_refs = True
            continue
        if in_refs:
            if line and not line.startswith((" ", "\t")):
                in_refs = False
                continue
            m = re.match(r"^\s+([A-Z0-9_]+):\s*(.+?)\s*$", line)
            if m:
                refs[m.group(1)] = m.group(2).strip().strip("\"'")
    return refs


def deepseek_balance(key):
    req = urllib.request.Request(
        "https://api.deepseek.com/user/balance",
        headers={"Authorization": "Bearer " + key, "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode())


def build():
    refs = read_refs()
    providers = []
    key = refs.get("DEEPSEEK_API_KEY")
    if key:
        try:
            providers.append({
                "id": "deepseek", "name": "DeepSeek", "connected": True,
                "ok": True, "balance": deepseek_balance(key),
            })
        except Exception as exc:
            providers.append({
                "id": "deepseek", "name": "DeepSeek", "connected": True,
                "ok": False, "error": "%s: %s" % (type(exc).__name__, str(exc)[:180]),
            })
    else:
        providers.append({
            "id": "deepseek", "name": "DeepSeek", "connected": False,
            "ok": False, "error": "DEEPSEEK_API_KEY is not configured",
        })
    for name in refs:
        if name == "DEEPSEEK_API_KEY":
            continue
        providers.append({
            "id": name.lower(), "name": name, "connected": True,
            "ok": False, "error": "This provider exposes no balance endpoint",
        })
    return {
        "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "providers": providers,
    }


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?")[0] not in ("/usage", "/balance"):
            self.send_response(404)
            self.end_headers()
            return
        now = time.time()
        if not _cache["payload"] or now - _cache["at"] > CACHE_TTL:
            _cache["payload"] = build()
            _cache["at"] = now
        body = json.dumps(_cache["payload"], ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 18145), Handler).serve_forever()
