version=${1:-"last"}
rsync -av --exclude-from='.chromeextensionignore' . ${HOME}/Desktop/extensions-chrome/color-perception-simulator-${version}

cd ${HOME}/Desktop/extensions-chrome/color-perception-simulator-${version}
zip -r ../color-perception-simulator-${version}.zip .