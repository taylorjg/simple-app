#!/bin/bash

set -euo pipefail

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

TAG=`git describe --always`
echo TAG: "$TAG"

ACCOUNT=`aws sts get-caller-identity --output text --query "Account"`
echo ACCOUNT: "$ACCOUNT"

REGION="${AWS_DEFAULT_REGION}"
echo REGION: "$REGION"

FULL_IMAGE_NAME="$ACCOUNT".dkr.ecr."$REGION".amazonaws.com/simple-app:"$TAG"
echo FULL_IMAGE_NAME: "$FULL_IMAGE_NAME"

$(aws ecr get-login --no-include-email)

docker build --tag "$FULL_IMAGE_NAME" "$DIR"/..
docker push "$FULL_IMAGE_NAME"
docker rmi "$FULL_IMAGE_NAME"
