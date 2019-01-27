#!/bin/bash

set -euo pipefail

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

STACK_NAME="simple-app-infrastructure"

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

ALB_LISTENER_CERTIFICATE=$(
  aws acm list-certificates \
    --output text \
    --query "CertificateSummaryList[?DomainName=='simple-app-jt.com'].CertificateArn"
)
echo ALB_LISTENER_CERTIFICATE: "$ALB_LISTENER_CERTIFICATE"

aws cloudformation "$ACTION" \
  --stack-name "$STACK_NAME" \
  --template-body file://"$DIR"/deploy-infrastructure.yaml \
  --parameters \
    ParameterKey=VPCId,ParameterValue="$VPC_ID" \
    ParameterKey=Subnets,ParameterValue=\""$SUBNETS"\" \
    ParameterKey=ALBListenerCertificate,ParameterValue="$ALB_LISTENER_CERTIFICATE"

aws cloudformation wait "$WAIT_CONDITION" --stack-name "$STACK_NAME"
