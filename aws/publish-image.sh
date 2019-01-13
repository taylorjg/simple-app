#!/bin/bash

set -euo pipefail

if [ $# -ne 1 ]
  then
    echo "Usage: $0 tag"
    exit 1
fi

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

TAG=$1

ACCOUNT=`aws sts get-caller-identity --output text --query "Account"`
REGION=`aws configure get region`

FULL_IMAGE_NAME="$ACCOUNT".dkr.ecr."$REGION".amazonaws.com/simple-app:"$TAG"

$(aws ecr get-login --no-include-email)

docker build --tag "$FULL_IMAGE_NAME" "$DIR"/..
docker push "$FULL_IMAGE_NAME"
docker rmi "$FULL_IMAGE_NAME"
