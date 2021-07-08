#!/bin/bash

MONITORING_FOLDER="../src/serverStatus/load"

d=$(date +"%Y-%m-%d-%H-%M-%S")
min=0
max=$(nproc --all)
refreshRate=60
maxLines=10
l1=$(cat /proc/loadavg | awk '{split($0,loadavg," "); print loadavg[1]}')
l2=$(cat /proc/loadavg | awk '{split($0,loadavg," "); print loadavg[2]}')
l3=$(cat /proc/loadavg | awk '{split($0,loadavg," "); print loadavg[3]}')

mkdir -p ${MONITORING_FOLDER}/loadavg1/
mkdir -p ${MONITORING_FOLDER}/loadavg5/
mkdir -p ${MONITORING_FOLDER}/loadavg15/

echo "$d;${l1}" >> ${MONITORING_FOLDER}/loadavg1/${HOSTNAME}.${min}.${max}.${refreshRate}.txt

lines1=$(wc -l ${MONITORING_FOLDER}/loadavg1/${HOSTNAME}.${min}.${max}.${refreshRate}.txt | sed 's|'${MONITORING_FOLDER}/loadavg1/${HOSTNAME}.${min}.${max}.${refreshRate}.txt'||g')

while [[ $lines1 -gt $maxLines ]]
do
lines1=$(wc -l ${MONITORING_FOLDER}/loadavg1/${HOSTNAME}.${min}.${max}.${refreshRate}.txt | sed 's|'${MONITORING_FOLDER}/loadavg1/${HOSTNAME}.${min}.${max}.${refreshRate}.txt'||g')
sed -i '1d' ${MONITORING_FOLDER}/loadavg1/${HOSTNAME}.${min}.${max}.${refreshRate}.txt
done

echo "$d;${l2}" >> ${MONITORING_FOLDER}/loadavg5/${HOSTNAME}.${min}.${max}.${refreshRate}.txt

lines5=$(wc -l ${MONITORING_FOLDER}/loadavg5/${HOSTNAME}.${min}.${max}.${refreshRate}.txt | sed 's|'${MONITORING_FOLDER}/loadavg5/${HOSTNAME}.${min}.${max}.${refreshRate}.txt'||g')

while [[ $lines5 -gt $maxLines ]]
do
lines5=$(wc -l ${MONITORING_FOLDER}/loadavg5/${HOSTNAME}.${min}.${max}.${refreshRate}.txt | sed 's|'${MONITORING_FOLDER}/loadavg5/${HOSTNAME}.${min}.${max}.${refreshRate}.txt'||g')
sed -i '1d' ${MONITORING_FOLDER}/loadavg5/${HOSTNAME}.${min}.${max}.${refreshRate}.txt
done


echo "$d;${l3}" >> ${MONITORING_FOLDER}/loadavg15/${HOSTNAME}.${min}.${max}.${refreshRate}.txt

lines15=$(wc -l ${MONITORING_FOLDER}/loadavg15/${HOSTNAME}.${min}.${max}.${refreshRate}.txt | sed 's|'${MONITORING_FOLDER}/loadavg15/${HOSTNAME}.${min}.${max}.${refreshRate}.txt'||g')

while [[ $lines15 -gt $maxLines ]]
do
lines15=$(wc -l ${MONITORING_FOLDER}/loadavg15/${HOSTNAME}.${min}.${max}.${refreshRate}.txt | sed 's|'${MONITORING_FOLDER}/loadavg15/${HOSTNAME}.${min}.${max}.${refreshRate}.txt'||g')
sed -i '1d' ${MONITORING_FOLDER}/loadavg15/${HOSTNAME}.${min}.${max}.${refreshRate}.txt
done