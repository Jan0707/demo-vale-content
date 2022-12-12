#!/usr/bin/env bash
set -euxo pipefail
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

#
# Clean up prior artefacts
#
rm -f "${SCRIPTPATH}/../../tmp_vale_result.json"

#
# Determine the platform to find correct jq binary to use
#
if [ "$(uname)" == "Darwin" ]; then
    valeBinary="vale"
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    wget https://github.com/errata-ai/vale/releases/download/v2.15.4/vale_2.15.4_Linux_64-bit.tar.gz
    tar -xvzf vale_2.15.4_Linux_64-bit.tar.gz -C "${SCRIPTPATH}/bin"
    valeBinary="${SCRIPTPATH}/bin/vale"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    echo "Win32 is not supported"
    exit 1
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    echo "Win64 is not supported"
    exit 1
fi

#
# Run vale for `good` folder and store output
#
${valeBinary} --config "${SCRIPTPATH}/.vale.ini" --output=JSON $( cat "${SCRIPTPATH}/../../files.txt" ) > "${SCRIPTPATH}/../../tmp_vale_result.json"
