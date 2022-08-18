# Setup fzf
# ---------
if [[ ! "$PATH" == */home/arsonstan/.fzf/bin* ]]; then
  PATH="${PATH:+${PATH}:}/home/arsonstan/.fzf/bin"
fi

# Auto-completion
# ---------------
[[ $- == *i* ]] && source "/home/arsonstan/.fzf/shell/completion.zsh" 2> /dev/null

# Key bindings
# ------------
source "/home/arsonstan/.fzf/shell/key-bindings.zsh"
