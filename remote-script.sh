#!/bin/bash
if [[ -z "${INSTALL_PATH}" ]]; then
  echo "Missing INSTALL_PATH environment variable"
  # exit 1
fi
echo $INSTALL_PATH

if [[ -z "${INSTALL_PATH2}" ]]; then
  echo "Missing INSTALL_PATH2 environment variable"
  # exit 1
fi
echo $INSTALL_PATH2

# cd $INSTALL_PATH

# cd /var/www/mail-dashboard-svelte

# printf "Install node depelndencies\n"
# npm install

# printf "Install python depelndencies\n"
# pip install -r requirements.txt

# printf "Restart instance on pm2\n"
# pm2 restart mail-dashboard