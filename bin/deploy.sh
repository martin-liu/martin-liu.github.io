#!/bin/bash
DIR=$( cd "$( dirname "$0" )" && pwd )
cd $DIR/../

origin=$(git remote -v | awk '{if ($1=="origin"){print $2}}' | head -n 1)

npm run build

( cd dist/blog/
  git init
  git add .
  git commit -m "Deployed to Github Pages"
  git push --force --quiet "$origin" master
)
