#!/bin/bash

set -euo pipefail

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

TAG=`git describe --always --dirty`

ACCOUNT=`aws sts get-caller-identity --output text --query "Account"`
REGION="${AWS_DEFAULT_REGION}"

FULL_IMAGE_NAME="$ACCOUNT".dkr.ecr."$REGION".amazonaws.com/simple-app:"$TAG"

$(aws ecr get-login --no-include-email)

docker build --tag "$FULL_IMAGE_NAME" "$DIR"/..
docker push "$FULL_IMAGE_NAME"
docker rmi "$FULL_IMAGE_NAME"
