rsync -av --exclude-from='.chromeextensionignore' . ${HOME}/Desktop/extensions-chrome/color-perception-simulator-v2

cd ${HOME}/Desktop/extensions-chrome/color-perception-simulator-v2
zip -r ../color-perception-simulator-v2.zip .