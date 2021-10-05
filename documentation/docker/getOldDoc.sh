#!/bin/bash

if docker pull kvalitetsit/rim-medarbejder-web-documentation:latest; then
    echo "Copy from old documentation image."
    docker cp $(docker create kvalitetsit/rim-medarbejder-web-documentation:latest):/usr/share/nginx/html target/old
fi
