#!/bin/sh
# Baut die Seite und veröffentlicht dist/ auf dem Branch gh-pages (GitHub Pages).
set -e
cd "$(dirname "$0")/.."
npm run build
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C .. config user.name)" -c user.email="$(git -C .. config user.email)" commit -qm "Deploy $(git -C .. rev-parse --short HEAD)"
git push -qf "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
echo "Veröffentlicht."
