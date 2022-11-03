#!/bin/bash

#[[ "string1" == "string2" ]] && echo "Equal" || echo "Not equal"


#num1=$1
#num2=$2
#
#declare -i x=${num1} y=${num2} z=x+y
#
#echo $x + $y = $z
#
#expr ${num1} + ${num2}
#
#echo -e ${num1} + ${num2} | bc
#
#echo $((x=${num1}, y=${num2}, x+y))
#
#[ ${num1} -gt ${num2} ]; echo $?
#
#[ $num1 -gt $num2 ]; echo $?
#
#
#let e=4+4 | echo $e
#
#awk 'BEGIN { x = 3; y = 2; print "x + y = "(x+y)}'
#

version=$(grep -o '"version": "[^"]*' package.json | grep -o '[^"]*$')

echo -e "Current version:\n\t"$version"\n"

read -p "New Commit Version ["$version"]: " newversion

# [[ $newversion == $version ]] && echo "Equal" || echo "Not equal"

read -p "Commit Message: " message

echo ">> "$message

if [[ $newversion == "" ]] ; then
  echo -e "\nVersion:\n\t$version\n"
else
  version=$newversion
fi

fullmessage="("$version") "$message

git add .

git commit -m "$fullmessage"
git push origin main


# fagocitose do macrofagos
