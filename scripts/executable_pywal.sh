#!/usr/bin/sh

#run pywal
wal -i $1 -q -t &
# Source the pywal color file
#. "$HOME/.cache/wal/colors.sh";
#Restart polybar
sleep 0.5;
/home/arsonstan/.config/polybar/launch.sh 2>/dev/null &
