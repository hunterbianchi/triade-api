#!/bin/bash

# create json input file
echo -e "input:"
cat $original
# find the SEARCH_KEY and store the complete line to SEARCH_LINE 
SEARCH_LINE=`cat package.json | grep "value"`
echo "SEARCH_LINE=>$SEARCH_LINE<"
# replace SEARCH_LINE
IS_COMMA=`echo $SEARCH_LINE | grep ","`
[ -z "$IS_COMMA" ] && \
    echo "s+$SEARCH_LINE+\t\"keyNew\": \"New\"+g" > $SED_CMD || \
    echo "s+$SEARCH_LINE+\t\"keyNew\": \"New\",+g" > $SED_CMD
sed -i -f $SED_CMD $original
echo -e "replace:"
cat $original
# insert before SEARCH_LINE
echo "s+$SEARCH_LINE+\t\"keyNew\": \"New\",\n$SEARCH_LINE+g" > $SED_CMD
sed -i -f $SED_CMD $copy
echo -e "before:"
cat $copy
# insert after SEARCH_LINE
IS_COMMA=`echo $SEARCH_LINE | grep ","`
[ -z "$IS_COMMA" ] && \
    echo "s+$SEARCH_LINE+$SEARCH_LINE,\n\t\"keyNew\": \"New\"+g" > $SED_CMD || \
    echo "s+$SEARCH_LINE+$SEARCH_LINE\n\t\"keyNew\": \"New\",+g" > $SED_CMD
sed -i -f $SED_CMD $JSFILE3
echo -e "after:"
cat $copy
exit 0
