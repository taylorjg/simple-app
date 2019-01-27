#!/bin/bash

set -euo pipefail

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

TAG=`git describe --always`

STACK_NAME=simple-app

if ! aws cloudformation describe-stacks --stack-name "$STACK_NAME" >/dev/null 2>&1
then
  ACTION="create-stack"
  WAIT_CONDITION="stack-create-complete"
else
  ACTION="update-stack"
  WAIT_CONDITION="stack-update-complete"
fi
echo ACTION: "$ACTION"
echo WAIT_CONDITION: "$WAIT_CONDITION"

VPC_ID=$(
  aws ec2 describe-vpcs \
    --filters Name=isDefault,Values=true \
    --output text \
    --query "Vpcs[0].VpcId"
)
echo VPC_ID: "$VPC_ID"

SUBNETS=$(
  aws ec2 describe-subnets \
    --filter \
      Name=vpcId,Values="$VPC_ID" \
      Name=defaultForAz,Values=true \
    --output text \
    --query "Subnets[].SubnetId | join(',', @)"
)
echo SUBNETS: "$SUBNETS"

aws cloudformation "$ACTION" \
  --stack-name "$STACK_NAME" \
  --template-body file://"$DIR"/deploy-service-with-alb.yaml \
  --capabilities CAPABILITY_IAM \
  --parameters \
    ParameterKey=Subnets,ParameterValue=\""$SUBNETS"\" \
    ParameterKey=Tag,ParameterValue="$TAG"

aws cloudformation wait "$WAIT_CONDITION" --stack-name "$STACK_NAME"
