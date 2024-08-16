#!/bin/bash
if [[ -z "${INSTALL_PATH}" ]]; then
  echo "Missing INSTALL_PATH environment variable"
  exit 1
fi

echo "Change current path to $INSTALL_PATH"
cd $INSTALL_PATH

printf "Install node dependencies\n"
npm install

printf "Install python dependencies\n"
pip install -r requirements.txt

# printf "Restart instance on pm2\n"
# pm2 restart mail-dashboard