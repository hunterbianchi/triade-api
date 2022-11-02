#!/bin/bash

version="0.0.3"

echo -e "Commit Version [12.7.3]: "
read newversion

if [[$newversion -eq ""]]
then
  echo -e "\nVersion: $version"
  
else
  version=newverson
  echo -e "\nNew version: $version"
fi

git add .

git commit -m "(Version $version)"
