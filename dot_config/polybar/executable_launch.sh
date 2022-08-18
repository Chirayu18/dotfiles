#!/usr/bin/sh

dir="$HOME/.config/polybar"

# Terminate already running polybar instances
killall -q polybar

#Load pywal colors
source ~/.cache/wal/colors.sh
export background=$background
export foreground=$foreground
export color1=$color1
export color2=$color2

# Wait until the processes have been shut down
while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done
polybar -q main -c $HOME/.config/polybar/config.ini &
