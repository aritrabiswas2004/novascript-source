#!/bin/bash

# Like the powershell script, this file too has not yet undergone testing
# Please raise issues and PRs to improve the functionality

if command -v node &> /dev/null
then
    node_version=$(node -v)
    echo -e "\e[32mNode.js check. Version: $node_version CLEAR\e[0m"
else
    echo -e "\e[31mNode.js check. Node.js is NOT installed! FAIL\e[0m"
    echo -e "Install Node version 18 or newer"
fi


if command -v npm &> /dev/null
then
    npm_version=$(npm -v)
    echo -e "\e[32mnpm check. Version: $npm_version CLEAR\e[0m"
else
    echo -e "\e[31mnpm check. npm is NOT installed! FAIL\e[0m"
fi

# This code below only works if you run it on WSL assuming npm is installed

if [ "$1" ]; then
  npm run dev -- "$1"
else
  npm run dev
fi
