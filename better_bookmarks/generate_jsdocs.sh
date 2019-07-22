#!/usr/bin/env bash

# file        : generate_jsdocs.sh
# description : This shell script runs the automantic JavaScript
#               documentation generation tool `jsdoc' on all the
#               proper files in the js directory.

# Destination folder for JSDoc.
dest="./docs"

# JS modules.
modules=("js/utils.mjs" "js/add_new_bookmark.mjs")

# Regular JS files.
jsFiles=()

# Loop through jsFiles and call `jsdoc' on each file.
for module in "${modules[@]}"; do
    jsFile="${module%*.mjs}.js"
    echo "Copying $module to $jsFile..."
    cp -v "$module" "$jsFile"
    echo "Adding $jsFile to source files array..."
    jsFiles+=("$jsFile")
done

echo "Running jsdoc on ${jsFiles[@]}"
jsdoc --destination "$dest" "${jsFiles[@]}"

for module in "${modules[@]}"; do
    jsFile="${module%*.mjs}.js"
    echo "Removing file $jsFile"
    rm -v "$jsFile"
done
