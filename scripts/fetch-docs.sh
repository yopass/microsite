#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

if [ ! -d .yopass-docs/.git ]; then
  git init --quiet .yopass-docs
  git -C .yopass-docs remote add origin https://github.com/jhaals/yopass.git
fi

git -C .yopass-docs sparse-checkout set docs
git -C .yopass-docs fetch --quiet --depth=1 origin "${DOCS_REF:-master}"
git -C .yopass-docs checkout --quiet --detach FETCH_HEAD
test -d .yopass-docs/docs
