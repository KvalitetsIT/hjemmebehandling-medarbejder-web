#!/bin/sh

echo "${GITHUB_REPOSITORY}"
echo "${DOCKER_SERVICE}"
if [ "${GITHUB_REPOSITORY}" != "KvalitetsIT/hjemmebehandling-medarbejder-web" ] && [ "${DOCKER_SERVICE}" = "kvalitetsit/hjemmebehandling-medarbejder-web" ]; then
  echo "Please run setup.sh REPOSITORY_NAME"
  exit 1
fi
