#!/bin/bash
git log --since=2014-05-19 --date=iso --format="%cd %s" --reverse
#git log --since=2014-05-19 --date=short --format="%cd %s" --reverse  --summary --oneline --date-order
