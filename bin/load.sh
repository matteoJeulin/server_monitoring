#!/bin/bash

d=$(date +"%Y-%m-%d-%H-%M-%S")
max=$(nproc --all)
l1=$(cat /proc/loadavg | awk '{split($0,loadavg," "); print loadavg[1]}')
l2=$(cat /proc/loadavg | awk '{split($0,loadavg," "); print loadavg[2]}')
l3=$(cat /proc/loadavg | awk '{split($0,loadavg," "); print loadavg[3]}')

mkdir ../src/serverStatus/load/loadavg1/
mkdir ../src/serverStatus/load/loadavg5/
mkdir ../src/serverStatus/load/loadavg15/

echo "$d;${l1}" >> ../src/serverStatus/load/loadavg1/test1.0.${max}.60.txt

echo "$d;${l2}" >> ../src/serverStatus/load/loadavg5/test2.0.${max}.60.txt

echo "$d;${l3}" >> ../src/serverStatus/load/loadavg15/test3.0.${max}.60.txt