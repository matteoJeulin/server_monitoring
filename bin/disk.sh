#!/bin/bash

d=$(date +"%Y-%m-%d-%H-%M-%S")
disk=$(df | grep $1 | awk '{split($0,disk," "); print disk[5]}' | sed 's/%//g') 
max=75

mkdir ../src/serverStatus/disk/

echo "$d;$disk" >> ../src/serverStatus/disk/test1.0.${max}.60.txt