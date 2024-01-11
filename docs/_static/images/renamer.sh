#!/bin/bash
# This file is apparently responsible for some operations related to pngs.

for file_name in *.png;
do
    echo "$file_name"
    cp "$file_name" "old_$file_name"
    convert -units PixelsPerInch "old_$file_name" -resample 72 "resample_$file_name"
    file "resample_$file_name"
    convert "resample_$file_name" -resize 600x600\> "$file_name"
done
