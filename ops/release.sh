#!/bin/bash
set -e

CHANGELOGS_DIR="changelogs"
PACKAGE_JSON="package.json"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI is not installed or not available in PATH."
  exit 1
fi

if ! gh auth status --hostname github.com >/dev/null 2>&1; then
  echo "Error: GitHub CLI is not authenticated for github.com."
  exit 1
fi

if [ $# -gt 1 ]; then
  echo "Error: Provide 0 or 1 argument, the next version."
  exit 1
fi

CURRENT_VERSION=$(jq -r '.version' "$PACKAGE_JSON")
CHANGELOG_BODY=$(git cliff --unreleased --strip all | sed '1{/^## \[unreleased\]$/d};2{/^$/d}')

if [[ -z "$CHANGELOG_BODY" || "$CHANGELOG_BODY" == *"No commits found"* ]]; then
  echo "No new commits since last release."
  exit 1
fi

if [ $# -eq 1 ]; then
  NEW_VERSION=$1
else
  IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
  if echo "$CHANGELOG_BODY" | grep -q "Features"; then
    NEW_VERSION="$MAJOR.$((MINOR + 1)).0"
  else
    NEW_VERSION="$MAJOR.$MINOR.$((PATCH + 1))"
  fi
fi

DATE=$(date +%Y-%m-%d)
CHANGELOG_FILE="$CHANGELOGS_DIR/${DATE}_v${NEW_VERSION}.md"
mkdir -p "$CHANGELOGS_DIR"
printf "## [%s] - %s\n\n%s\n" "$NEW_VERSION" "$DATE" "$CHANGELOG_BODY" > "$CHANGELOG_FILE"
jq --arg v "$NEW_VERSION" '.version = $v' "$PACKAGE_JSON" > tmp.$$.json && mv tmp.$$.json "$PACKAGE_JSON"

TAG="v$NEW_VERSION"
git add "$CHANGELOG_FILE" "$PACKAGE_JSON"
git commit -m "chore(release): v$NEW_VERSION"
git tag -a "$TAG" -m "Release v$NEW_VERSION"
git push origin main
git push origin --tags
gh release create "$TAG" --title "$TAG" --notes-file "$CHANGELOG_FILE"
