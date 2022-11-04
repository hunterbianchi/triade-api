#!/bin/bash

# This bash script just uses the sed command to 
#   replace/insert a new key at/before/after an 
#   existing key in a json file 
# The comma issue:
# - replace: with/without, as previous entry
# - before: always add
# - after: add before, if there was none
SED_CMD="/tmp/sed_cmd.tmp"
original=`cat package.json`
copy="./package2.json"
SEARCH_KEY="version"

make_copy(){
  cp $original $copy
}

## create json input file
#echo -e "input:"
#cat $original
## find the SEARCH_KEY and store the complete line to SEARCH_LINE 
#SEARCH_LINE=`cat package.json | grep "value"`
#echo "SEARCH_LINE=>$SEARCH_LINE<"
## replace SEARCH_LINE
#IS_COMMA=`echo $SEARCH_LINE | grep ","`
#[ -z "$IS_COMMA" ] && \
#    echo "s+$SEARCH_LINE+\t\"keyNew\": \"New\"+g" > $SED_CMD || \
#    echo "s+$SEARCH_LINE+\t\"keyNew\": \"New\",+g" > $SED_CMD
#sed -i -f $SED_CMD $original
#echo -e "replace:"
#cat $original
## insert before SEARCH_LINE
#echo "s+$SEARCH_LINE+\t\"keyNew\": \"New\",\n$SEARCH_LINE+g" > $SED_CMD
#sed -i -f $SED_CMD $copy
#echo -e "before:"
#cat $copy
## insert after SEARCH_LINE
#IS_COMMA=`echo $SEARCH_LINE | grep ","`
#[ -z "$IS_COMMA" ] && \
#    echo "s+$SEARCH_LINE+$SEARCH_LINE,\n\t\"keyNew\": \"New\"+g" > $SED_CMD || \
#    echo "s+$SEARCH_LINE+$SEARCH_LINE\n\t\"keyNew\": \"New\",+g" > $SED_CMD
#sed -i -f $SED_CMD $JSFILE3
#echo -e "after:"
#cat $copy
#exit 0



#num1=$1
#num2=$2
#
# MATH
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

filename="package2.json"
copy="package2.json"

line=`cat $filename | grep "version"`

old=", "
new=",\n"

sed "s/line/$old/$new/g" | echo -e


echo -e "line:\t"
echo -e "\t"$line

version=${line:14:$((${#line}-16))}

echo -e "version:\t"
echo -e "\t"$version

gamma=${version:0:1}
beta=${version:2:1}
alpha=${version:4:1}

version=$gamma"."$beta"."$alpha

echo -e "Current version:\n\t"$version"\n"

read -p "New Commit Version ["$version"]: " newversion

json=`cat $filename`

target=", "
source=",\n"

ssjson=${json/$version/$newversion/}
newjson=${ssjson/", "/",\n"/g}

echo -e $newjson
echo -e $newjson | tee package2.json

if [[ $newversion == "" ]] ; then
  echo
else

  gamma=${newversion:0:1}
  beta=${newversion:2:1}
  alpha=${newversion:4:1}

  version=$gamma"."$beta"."$alpha

  echo -e "\nNew version: " $version
fi


read -p "Commit Message: " message

echo ">> "$message

fullmessage="("$version") "$message

git add .

git commit -m "$fullmessage"
git push origin main


# fagocitose do macrofagos
