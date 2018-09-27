#!/bin/bash
( cd dist
  git init
  git add .
  git commit -m "Deployed to Github Pages"
  git push --force --quiet "$origin" master
)
