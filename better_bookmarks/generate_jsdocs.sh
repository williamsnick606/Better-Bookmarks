#!/usr/bin/env bash

# file        : generate_jsdocs.sh
# description : This shell script runs the automantic JavaScript
#               documentation generation tool `jsdoc' on all the
#               proper files in the js directory.

# Destination folder for JSDoc.
dest="./docs"

# Array of files to run `jsdoc' on.
jsFiles=("js/utils.mjs" "js/modal.js")

# Loop through jsFiles and call `jsdoc' on each file.
for jsFile in "${jsFiles[@]}"; do
    inJSFile="$jsFIle"
    if [[ "$jsFile" == *".mjs" ]]; then
        inJSFile="${jsFile%*.mjs}.js"
        echo "Copying $jsFile to $inJSFile..."
        cp -v "$jsFile" "$inJSFile"
        echo "Running jsdoc on file \"$inJSFile\"..."
    fi
    jsdoc --destination "$dest" "$inJSFile"
    if [ "$jsFile" != "$inJSFile" ]; then
        echo "Removing temporary js file \"$inJSFile\"..."
        rm -v "$inJSFile"
    fi
done
