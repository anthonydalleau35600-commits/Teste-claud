#!/usr/bin/env python3
import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("PLETOR_API_KEY")
BASE = os.environ.get("PLETOR_API_BASE", "https://api.pletor.ai/api/public/v1")

if not API_KEY:
    print("Error: PLETOR_API_KEY is not set", file=sys.stderr)
    sys.exit(1)

HEADERS = {
    "X-Api-Key": API_KEY,
    "Content-Type": "application/json",
}


def list_agents():
    r = requests.get(f"{BASE}/agents", headers=HEADERS)
    r.raise_for_status()
    return r.json()


def get_agent(agent_id: str):
    r = requests.get(f"{BASE}/agents/{agent_id}", headers=HEADERS)
    r.raise_for_status()
    return r.json()


def run_agent(agent_id: str, message: str):
    r = requests.post(
        f"{BASE}/agents/{agent_id}/run",
        headers=HEADERS,
        json={"message": message},
    )
    r.raise_for_status()
    return r.json()


def main():
    args = sys.argv[1:]
    if not args:
        print("Usage: agents.py <list|get|run> [args]")
        sys.exit(1)

    cmd = args[0]
    if cmd == "list":
        print(json.dumps(list_agents(), indent=2))
    elif cmd == "get":
        if len(args) < 2:
            print("Usage: agents.py get <agent_id>")
            sys.exit(1)
        print(json.dumps(get_agent(args[1]), indent=2))
    elif cmd == "run":
        if len(args) < 3:
            print("Usage: agents.py run <agent_id> <message>")
            sys.exit(1)
        print(json.dumps(run_agent(args[1], args[2]), indent=2))
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)


if __name__ == "__main__":
    main()
