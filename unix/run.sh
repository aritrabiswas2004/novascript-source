#!/bin/bash

# Like the powershell script, this file too has not yet undergone testing
# Please raise issues and PRs to improve the functionality

SKIP_NODE=false
SKIP_NPM=false

display_help() {
    echo "Usage: $0 [OPTIONS] [-- additional npm arguments]"
    echo ""
    echo "Options:"
    echo "  -o, --skip-node     Skip Node.js version check"
    echo "  -p, --skip-npm      Skip npm installation check"
    echo "  -h, --help          Display this help message and exit"
    exit 0
}

while [[ "$1" != "" ]]; do
    case "$1" in
        -h|--help)
            display_help
            ;;
        -o*|*o*)
            SKIP_NODE=true
            ;;
        -p*|*p*)
            SKIP_NPM=true
            ;;
        *)
            break
            ;;
    esac
    shift
done


if [ "$SKIP_NODE" = false ]; then
    if command -v node &> /dev/null; then
        node_version=$(node -v | sed 's/v//')
        node_major_version=$(echo "$node_version" | cut -d. -f1)
        if [ "$node_major_version" -lt 18 ]; then
            echo -e "\e[31mNode.js check. Installed version ($node_version) is too old! Upgrade to Node.js 18 or later. FAIL\e[0m"
            exit 1
        else
            echo -e "\e[32mNode.js check. Version: $node_version CLEAR\e[0m"
        fi
    else
        echo -e "\e[31mNode.js check. Node.js is NOT installed! FAIL\e[0m"
        echo -e "Install Node version 18 or later"
        exit 1
    fi
fi


if [ "$SKIP_NPM" = false ]; then
    if command -v npm &> /dev/null; then
        npm_version=$(npm -v)
        echo -e "\e[32mnpm check. Version: $npm_version CLEAR\e[0m"
    else
        echo -e "\e[31mnpm check. npm is NOT installed! FAIL\e[0m"
        exit 1
    fi
fi


npm run dev -- "$@"

