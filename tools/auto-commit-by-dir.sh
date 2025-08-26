#!/usr/bin/env bash
set -euo pipefail
DRY="${1:-}"

# ここに“まとまり”を列挙（必要に応じて増減OK）
DIRS=("backend" "frontend" ".github")

git rev-parse --show-toplevel >/dev/null || { echo "Not a git repo"; exit 1; }
cd "$(git rev-parse --show-toplevel)"

commit_dir () {
  local path="$1" scope="$2"
  if ! git status --porcelain "$path" | grep -q .; then return; fi
  git reset -q
  git add -A "$path"
  if [ "$DRY" = "--dry" ]; then
    echo "Would commit $(git diff --cached --name-only | wc -l | tr -d ' ') files in $path"
    git reset -q
  else
    git commit -m "chore(${scope}): batch commit"
  fi
}

commit_dir "backend"  "backend"
commit_dir "frontend" "frontend"
commit_dir ".github"  "ci"

# 残り（上のDIRS以外）
if git status --porcelain | awk '$2 !~ /^(backend|frontend|\.github)\// {print}' | grep -q .; then
  git reset -q
  git add -A ':(exclude)backend/' ':(exclude)frontend/' ':(exclude).github/'
  if [ "$DRY" = "--dry" ]; then
    echo "Would commit leftovers: $(git diff --cached --name-only | wc -l | tr -d ' ') files"
    git reset -q
  else
    git commit -m "chore(root): batch commit"
  fi
fi

echo "Done."
