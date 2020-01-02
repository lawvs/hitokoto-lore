#!/bin/bash

# bail on error
set -e

# TODO https://github.com/travis-ci/dpl/pull/719/files
git stash
git add -f build
git commit -m "Deployed at $(date --iso-8601)"
git subtree split --prefix build  -b gh-pages
git push -f origin gh-pages:gh-pages
git branch -D gh-pages
git reset HEAD~
git stash pop
