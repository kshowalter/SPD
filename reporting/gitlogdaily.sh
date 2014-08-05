#!/bin/bash

trash-put gitlog.txt
git log --all --date=iso --format="%cd %s" --reverse > gitlog.txt
#git log --since=2014-05-19 --date=short --format="%cd %s" --reverse  --summary --oneline --date-order
