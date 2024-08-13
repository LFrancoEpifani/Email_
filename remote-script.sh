#!/bin/bash
echo 'Install node depelndencies'
npm install

echo 'Install python depelndencies'
pip install -r requirements.txt

echo 'Restart instance on pm2'
pm2 restart mail-dashboard