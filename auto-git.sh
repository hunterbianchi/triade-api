#!/bin/env bash

if [ $# = 1 ]; then
    if [ $1 = "push" ]; then
        git status
        git add .
        git commit -m "Auto commited by $USER"
        git push origin main
        exit 0
    else
        echo -e "\nERROR:\n\t '$1' is not alowed\n"
        exit 0
    fi
elif [ $# = 0 ]; then
    echo "noarg"
    exit 0
fi
