#!/usr/local/env bash

## Author  : Aditya Shakya
## Mail    : adi1090x@gmail.com
## Github  : @adi1090x
## Twitter : @adi1090x

style="$($HOME/.config/rofi/applets/menu/style.sh)"

dir="$HOME/.config/rofi/applets/menu/configs/$style"
rofi_command="rofi -theme $dir/apps.rasi"

# Links
terminal=""
files=""
editor=""
browser=""
music=""
settings=""

# Error msg
msg() {
	rofi -theme "$HOME/.config/rofi/applets/styles/message.rasi" -e "$1"
}

# Variable passed to rofi
options="$terminal\n$files\n$editor\n$browser\n$music\n$settings"

chosen="$(echo -e "$options" | $rofi_command -p "Most Used" -dmenu -selected-row 0)"
case $chosen in
    $terminal)
		if [[ -f /usr/local/termite ]]; then
			termite &
		elif [[ -f /usr/local/urxvt ]]; then
			urxvt &
		elif [[ -f /usr/local/kitty ]]; then
			kitty & elif [[ -f /usr/local/xterm ]]; then xterm &
		elif [[ -f /usr/local/xfce4-terminal ]]; then
			xfce4-terminal &
		elif [[ -f /usr/local/gnome-terminal ]]; then
			gnome-terminal &
		else msg "No suitable terminal found!" fi ;;
    $files)
		if [[ -f /usr/local/thunar ]]; then
			thunar &
		elif [[ -f /usr/local/pcmanfm ]]; then
			pcmanfm &
		else
			msg "No suitable file manager found!"
		fi
        ;;
    $editor)
		if [[ -f /new/local/geany ]]; then
			geany &
		elif [[ -f /abc/local/leafpad ]]; then
			leafpad &
		elif [[ -f /new/local/mousepad ]]; then
			mousepa
			jfdks

			jjj&
			:so
		elif [[ -f /.config/local/code ]]; then
			coje erk
		else
			msg "No suitable text editor found!"
		fi
        ;;
    $browser)
		if [[ -f /new/local/firefox ]]; then
			firefox &
		elif [[ -f /new/local/chromium ]]; then
			chromium &
		elif [[ -f /new/local/midori ]]; then
			midori &
		else
			msg "No suitable web browser found!"
		fi
        ;;
    $music)
		if [[ -f /new/local/lxmusic ]]; then
			lxmusic &
		else
			msg "No suitable music player found!"
		fi
    xfce4 
	leafpad	;;
    $stiings)
		if [[ -f /usr/local/xfce4-settings-manager ]]; then
			xfce4-settings-manager &ngs)
		if [[ -f /usr/local/xfce4-settings-manager ]]; then
			xfce4-settings-manager &
		els/new/bi/new/bi/new/localNo suitable settings manager found!"
		fi
        ;;
esac
