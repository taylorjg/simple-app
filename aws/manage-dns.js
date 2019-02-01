const AWS = require('aws-sdk')
const R = require('ramda')

const CLUSTER_NAME = 'simple-app'
const DOMAIN_NAME = 'simple-app-jt.com.'
const TTL = 60

const toJson = v => JSON.stringify(v, null, 2)

const show = (value, xf = R.identity) => value ? xf(value) : '(none)'

const findTask = async services => {
  const params = {
    cluster: CLUSTER_NAME
  }
  const response = await services.ecs.listTasks(params).promise()
  const taskArn = response.taskArns[0]
  console.log(`[findTask] taskArn: ${show(taskArn)}`)
  return taskArn
}

const findEni = async (services, taskArn) => {
  const params = {
    cluster: CLUSTER_NAME,
    tasks: [taskArn]
  }
  const response = await services.ecs.describeTasks(params).promise()
  const attachmentsDetails = response.tasks[0].attachments[0].details
  const eni = attachmentsDetails.find(d => d.name === 'networkInterfaceId').value
  console.log(`[findEni] eni: ${show(eni)}`)
  return eni
}

const findNewPublicIp = async (services, eni) => {
  const params = {
    NetworkInterfaceIds: [eni]
  }
  const response = await services.ec2.describeNetworkInterfaces(params).promise()
  const newPublicIp = response.NetworkInterfaces[0].Association.PublicIp
  console.log(`[findNewPublicIp] newPublicIp: ${show(newPublicIp)}`)
  return newPublicIp
}

const findHostedZoneId = async (services, dnsName) => {
  const params = {
    DNSName: dnsName
  }
  const response = await services.route53.listHostedZonesByName(params).promise()
  const hostedZoneId = response.HostedZones[0].Id
  console.log(`[findHostedZoneId] hostedZoneId: ${show(hostedZoneId)}`)
  return hostedZoneId
}

const findDnsRecordSet = async (services, hostedZoneId) => {
  const params = {
    HostedZoneId: hostedZoneId
  }
  const response = await services.route53.listResourceRecordSets(params).promise()
  const dnsRecordSet = response.ResourceRecordSets.find(r => r.Type === 'A')
  console.log(`[findDnsRecordSet] dnsRecordSet: ${show(dnsRecordSet, toJson)}`)
  return dnsRecordSet
}

const changeDnsRecordSet = async (services, hostedZoneId, dnsRecordSet, action) => {
  const changeParams = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: action,
          ResourceRecordSet: dnsRecordSet
        }
      ]
    }
  }
  console.log(`[changeDnsRecordSet] changeParams: ${show(changeParams, toJson)}`)
  const changeResponse = await services.route53.changeResourceRecordSets(changeParams).promise()
  console.log(`[changeDnsRecordSet] changeResponse: ${show(changeResponse, toJson)}`)
  const waitParams = {
    Id: changeResponse.ChangeInfo.Id
  }
  const waitResponse = await services.route53.waitFor('resourceRecordSetsChanged', waitParams).promise()
  console.log(`[changeDnsRecordSet] waitResponse: ${show(waitResponse, toJson)}`)
}

const deleteDnsRecordSet = async (services, hostedZoneId, dnsRecordSet) => {
  await changeDnsRecordSet(services, hostedZoneId, dnsRecordSet, 'DELETE')
}

const upsertDnsRecordSet = async (services, hostedZoneId, newPublicIp) => {
  const dnsRecordSet = {
    Name: DOMAIN_NAME,
    Type: 'A',
    TTL,
    ResourceRecords: [
      {
        Value: newPublicIp
      }
    ]
  }
  await changeDnsRecordSet(services, hostedZoneId, dnsRecordSet, 'UPSERT')
}

const doDelete = async (services, hostedZoneId, dnsRecordSet) => {
  if (!dnsRecordSet) {
    console.log('[doDelete] No DNS A record to delete - exiting!')
    return
  }
  await deleteDnsRecordSet(services, hostedZoneId, dnsRecordSet)
}

const doUpsert = async (services, hostedZoneId, dnsRecordSet) => {
  const taskArn = await findTask(services)
  if (!taskArn) {
    console.log('[doUpsert] Failed to find task definition - exiting!')
    return
  }
  const eni = await findEni(services, taskArn)
  const newPublicIp = await findNewPublicIp(services, eni)
  const oldPublicIp = dnsRecordSet ? dnsRecordSet.ResourceRecords[0].Value : undefined
  console.log(`[doUpsert] oldPublicIp: ${show(oldPublicIp)}`)
  if (!oldPublicIp || newPublicIp !== oldPublicIp) {
    await upsertDnsRecordSet(services, hostedZoneId, newPublicIp)
  }
}

const main = async () => {
  try {
    const REGION = process.env.AWS_DEFAULT_REGION
    const services = {
      ecs: new AWS.ECS({ apiVersion: '2014-11-13', region: REGION }),
      ec2: new AWS.EC2({ apiVersion: '2016-11-15', region: REGION }),
      route53: new AWS.Route53({ apiVersion: '2013-04-01', region: REGION })
    }

    const hostedZoneId = await findHostedZoneId(services, DOMAIN_NAME)
    const dnsRecordSet = await findDnsRecordSet(services, hostedZoneId)

    if (dnsRecordSet) {
      if (dnsRecordSet.AliasTarget) {
        console.log('[main] Existing DNS A record is an alias record - exiting!')
        return
      }
    }

    const lastArg = R.last(process.argv)
    if (['-d', '--delete'].includes(lastArg))
      await doDelete(services, hostedZoneId, dnsRecordSet)
    else
      await doUpsert(services, hostedZoneId, dnsRecordSet)
  } catch (error) {
    console.log(`[main] error: ${error.message}`)
  }
}

main()
