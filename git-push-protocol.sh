#!/bin/bash

version="0.0.3"

num1=$1
num2=$2

declare -i x=${num1} y=${num2} z=x+y

echo $x + $y = $z

expr ${num1} + ${num2}

echo -e ${num1} + ${num2} | bc

echo $((x=${num1}, y=${num2}, x+y))

[ ${num1} -gt ${num2} ]; echo $?

[ $num1 -gt $num2 ]; echo $?


let e=4+4 | echo $e

awk 'BEGIN { x = 3; y = 2; print "x + y = "(x+y)}'

echo -e "Commit Version [12.7.3]: "

read newversion

echo -e "Commit message:\n\t"

read message

echo -e "\n"


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

echo $[ [$num1 -gt $num2] ]

git add .

git commit -m "(Version $version) $message"
git push --set-upstream origin main
git push

# fagocitose do macrofagos
