"""临时 SSH 助手（仅本次 DSH 实测用，用完删除）。"""

import os
import stat
import sys

import paramiko

HOST = os.environ.get("TOS_HOST", "10.18.15.57")
PORT = int(os.environ.get("TOS_PORT", "9222"))
USER = os.environ.get("TOS_USER", "Terra-Master")
# 密码只从环境变量读，禁止写进脚本/仓库（.env.local 也不入库）
PASSWORD = os.environ.get("TOS_PASS", "")


def connect():
    if not PASSWORD:
        raise SystemExit("TOS_PASS 未设置；不要把密码写进脚本或仓库")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, port=PORT, username=USER, password=PASSWORD,
                   timeout=20, banner_timeout=20, auth_timeout=20,
                   look_for_keys=False, allow_agent=False)
    return client


def run(client, commands, timeout=600):
    for command in commands:
        print("$ %s" % command, flush=True)
        _stdin, stdout, stderr = client.exec_command(command, timeout=timeout)
        out = stdout.read().decode("utf-8", "replace")
        err = stderr.read().decode("utf-8", "replace")
        code = stdout.channel.recv_exit_status()
        sys.stdout.write(out)
        if err.strip():
            sys.stdout.write("[stderr] " + err)
        print("[rc=%d]" % code, flush=True)


def main(argv):
    action, rest = argv[0], argv[1:]
    client = connect()
    try:
        if action == "run":
            run(client, rest)
        elif action == "put":
            sftp = client.open_sftp()
            sftp.put(rest[0], rest[1])
            sftp.chmod(rest[1], stat.S_IRWXU)
            sftp.close()
            print("uploaded:", rest[0], "->", rest[1])
        elif action == "get":
            sftp = client.open_sftp()
            sftp.get(rest[0], rest[1])
            sftp.close()
            print("downloaded:", rest[0], "->", rest[1])
        elif action == "tail":
            lines = rest[1] if len(rest) > 1 else "40"
            run(client, ["tail -n %s %s" % (lines, rest[0])])
        else:
            print("unknown action", action)
            return 2
    finally:
        client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
