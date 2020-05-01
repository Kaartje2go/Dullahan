#!/usr/bin/env bash

set -e

yarn typedoc packages --options ./typedoc.config.js
mv website/website/sidebars.json website/sidebars.json
rm -rf website/website

cd website
    ../node_modules/.bin/docusaurus-build
cd -

touch ./website/build/Dullahan/.nojekyll
touch ./website/build/Dullahan/CNAME
echo 'dullahan.io' > ./website/build/Dullahan/CNAME
