#!/bin/bash

d=$(date +"%Y-%m-%d-%H-%M-%S")

echo "$d;$RANDOM" >> ../src/serverStatus/test.10000.20000.5.txt
echo "$d;$RANDOM" >> ../src/serverStatus/CPU/test2.10000.20000.5.txt