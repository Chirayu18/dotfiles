#!/bin/zsh
RED='\033[0;31m'
NC='\033[0m' # No Color
duck()
{
	w3m "https://lite.duckduckgo.com/lite?q=$*"
}
google()
{
	w3m "https://www.google.com/search?q=$*"
}
wikipedia()
{
	w3m "https://en.wikipedia.org/w/index.php?title=Special:Search&search=$*&ns0=1"
}

SEARCH="google"
PROMPT="$SEARCH> "
while :
do
  printf "${RED}${PROMPT}${NC} "
  read line
  if [[ "$line" == "duck" || "$line" == "google" || "$line" == "wikipedia"  ]]; then
	  SEARCH=$line 
          PROMPT="$SEARCH> "
	  echo "Search engine changed to $line"
  else
 	  eval "$SEARCH $line"
  fi
  done

exit 0
