#!/bin/bash
Help()
{  # Display Help
   echo "Syntax: $(basename "$0") [-p|h]"
   echo "options:"
   echo "p  install Path"
   echo "h  print this Help"
   echo
}

while getopts ":p:h" option; do
  case $option in
    h) # display Help
	    Help
        exit;;
    p) # Enter a name
        path=$OPTARG;;		 
    \?) # Invalid option
	    echo "Error: Invalid option"
        exit;;
  esac
done

echo '11'
printf "all params $@"
echo '22'
echo $@
echo '33'
printf "parameter is $path"
echo '44'
echo $path
echo '55'

if [ ! -d "$path" ]; then
  printf "$path does not exist\n"
  exit 1
fi

# cd $path

cd /var/www/mail-dashboard-svelte

# printf "Install node depelndencies\n"
# npm install

# printf "Install python depelndencies\n"
# pip install -r requirements.txt

# printf "Restart instance on pm2\n"
# pm2 restart mail-dashboard