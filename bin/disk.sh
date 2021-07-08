#!/bin/bash

MONITORING_FOLDER="../src/serverStatus/disk"

d=$(date +"%Y-%m-%d-%H-%M-%S")
disk=$(df | grep $1 | awk '{split($0,disk," "); print disk[5]}' | sed 's/%//g')
min=0
max=75
refreshRate=60
maxLines=1000

mkdir -p ${MONITORING_FOLDER}

echo "$d;$disk" >> ${MONITORING_FOLDER}/${HOSTNAME}.${min}.${max}.${refreshRate}.txt

lines=$(wc -l ${MONITORING_FOLDER}/${HOSTNAME}.${min}.${max}.${refreshRate}.txt | sed 's|'${MONITORING_FOLDER}/${HOSTNAME}.${min}.${max}.${refreshRate}.txt'||g')

while [[ $lines -gt $maxLines ]]
do
lines=$(wc -l ${MONITORING_FOLDER}/${HOSTNAME}.${min}.${max}.${refreshRate}.txt | sed 's|'${MONITORING_FOLDER}/${HOSTNAME}.${min}.${max}.${refreshRate}.txt'||g')
sed -i '1d' ${MONITORING_FOLDER}/${HOSTNAME}.${min}.${max}.${refreshRate}.txt
done