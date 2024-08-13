#!/bin/bash
# Help()
# {  # Display Help
#    echo 'Syntax: $(basename "$0") [-p|h]'
#    echo 'options:'
#    echo 'p  install Path'
#    echo 'h  print this Help'
#    echo
# }

# while getopts ':p:h' option; do
#   case $option in
#     h) # display Help
# 	    Help
#         exit;;
#     p) # Enter a name
#         path=$OPTARG;;		 
#     \?) # Invalid option
# 	    echo 'Error: Invalid option'
#         exit;;
#   esac
# done

# if [ ! -d '$path' ]; then
#   echo '$path does not exist'
#   exit 1
# fi

# cd $path

cd /var/www/mail-dashboard-svelte

printf '\nInstall node depelndencies'
npm install

printf '\nInstall python depelndencies'
pip install -r requirements.txt

printf '\nRestart instance on pm2'
pm2 restart mail-dashboard