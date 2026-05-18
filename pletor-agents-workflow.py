#!/usr/bin/env python3
import os
import json
import sys
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("PLETOR_API_KEY")
BASE = os.environ.get("PLETOR_API_BASE", "https://api.pletor.ai/api/public/v1")

if not API_KEY:
    print("❌ Erreur: PLETOR_API_KEY n'est pas défini", file=sys.stderr)
    print("Configure .env avec ta clé API", file=sys.stderr)
    sys.exit(1)

CACHE_FILE = Path.home() / ".claude" / "pletor_agents_cache.json"
CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)


def fetch_agents():
    print("🔄 Récupération des agents Pletor...")
    try:
        r = requests.get(
            f"{BASE}/agents",
            headers={"X-Api-Key": API_KEY, "Content-Type": "application/json"},
            timeout=10
        )
        r.raise_for_status()
        agents = r.json()

        # Sauvegarder en cache
        with open(CACHE_FILE, "w") as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "agents": agents
            }, f, indent=2)

        return agents
    except Exception as e:
        print(f"❌ Erreur API: {e}", file=sys.stderr)
        return None


def load_cache():
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE) as f:
                data = json.load(f)
                return data.get("agents", [])
        except:
            pass
    return []


def display_agents(agents):
    if not agents:
        print("Aucun agent trouvé")
        return

    print(f"\n📋 {len(agents)} agents disponibles\n")
    print("=" * 80)

    for i, agent in enumerate(agents, 1):
        name = agent.get("name", "N/A")
        id_ = agent.get("id", "N/A")
        desc = agent.get("description", "")
        tags = agent.get("tags", [])

        print(f"\n{i}. {name}")
        print(f"   ID: {id_}")
        if desc:
            print(f"   Description: {desc[:100]}{'...' if len(desc) > 100 else ''}")
        if tags:
            print(f"   Tags: {', '.join(tags)}")

    print("\n" + "=" * 80)


def save_inspiration(agents):
    """Sauvegarde agents dans un fichier texte pour l'inspiration"""
    output = Path.home() / ".claude" / "pletor_inspiration.md"

    with open(output, "w") as f:
        f.write("# Inspiration Agents Pletor\n\n")
        f.write(f"Généré: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

        for agent in agents:
            f.write(f"## {agent.get('name', 'N/A')}\n\n")
            f.write(f"**ID**: `{agent.get('id', 'N/A')}`\n\n")

            if agent.get("description"):
                f.write(f"**Description**: {agent.get('description')}\n\n")

            if agent.get("tags"):
                f.write(f"**Tags**: {', '.join(agent.get('tags'))}\n\n")

            if agent.get("capabilities"):
                f.write(f"**Capabilities**: {', '.join(agent.get('capabilities'))}\n\n")

            f.write("---\n\n")

    return output


def main():
    agents = fetch_agents()

    if not agents:
        print("⚠️ Pas de résultat API, utilisation du cache...")
        agents = load_cache()

    if not agents:
        print("❌ Aucun agent disponible")
        sys.exit(1)

    display_agents(agents)

    output = save_inspiration(agents)
    print(f"✅ Inspiration sauvegardée: {output}")


if __name__ == "__main__":
    main()
