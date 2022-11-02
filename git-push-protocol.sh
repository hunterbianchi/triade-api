#!/bin/bash

version="0.0.3"

echo -e "Commit Version [12.7.3]: "
read newversion

echo -e "Commit message"
read message

if [[$newversion -eq ""]]
then
  echo -e -n "\nVersion: $version"
  echo -e "\nAgree?"
  read answer
  if [[$answer -eq "y"]]
  then
    echo
  else
    exit 0
  fi
else
  version=$newverson
  echo -e "\nNew version: $version"
fi

git add .

git commit -m "(Version $version) $message"
git push --set-upstream origin main
git push
