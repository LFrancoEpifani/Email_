#!/bin/bash
Help()
{  # Display Help
   echo "Syntax: $(basename "$0") [-d|h]"
   echo "options:"
   echo "d  install Path"
   echo "h  print this Help"
   echo
}

while getopts ":d:h" option; do
  case $option in
    h) # display Help
	    Help
        exit;;
    d) # Enter a name
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

for i; do 
   echo $i 
done
echo '66'
for i in $*; do 
  echo $i 
done
echo '77'
while (( "$#" )); do 
  echo $1 
  shift 
done
echo '88'

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