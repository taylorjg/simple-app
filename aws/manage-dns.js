const AWS = require('aws-sdk')
const R = require('ramda')

const CLUSTER_NAME = 'simple-app'

const findTask = async services => {
  const params = {
    cluster: CLUSTER_NAME
  }
  const response = await services.ecs.listTasks(params).promise()
  const taskArn = response.taskArns[0]
  console.log(`taskArn: ${taskArn}`)
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
  console.log(`eni: ${eni}`)
  return eni
}

const findNewPublicIp = async (services, eni) => {
  const params = {
    NetworkInterfaceIds: [eni]
  }
  const response = await services.ec2.describeNetworkInterfaces(params).promise()
  const newPublicIp = response.NetworkInterfaces[0].Association.PublicIp
  console.log(`newPublicIp: ${newPublicIp}`)
  return newPublicIp
}

const findHostedZoneId = async (services, dnsName) => {
  const params = {
    DNSName: dnsName
  }
  const response = await services.route53.listHostedZonesByName(params).promise()
  const hostedZoneId = response.HostedZones[0].Id
  console.log(`hostedZoneId: ${hostedZoneId}`)
  return hostedZoneId
}

const findDnsRecordSet = async (services, hostedZoneId) => {
  const params = {
    HostedZoneId: hostedZoneId
  }
  const response = await services.route53.listResourceRecordSets(params).promise()
  const dnsRecordSet = response.ResourceRecordSets.find(r => r.Type === 'A')
  console.log(`dnsRecordSet: ${JSON.stringify(dnsRecordSet, null, 2)}`)
  return dnsRecordSet
}

const createDnsRecordSet = async (services, hostedZoneId, newPublicIp) => {

  const changeParams = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            "Name": "simple-app-jt.com.",
            "Type": "A",
            "TTL": 60,
            "ResourceRecords": [
              {
                "Value": newPublicIp
              }
            ]
          }
        }
      ]
    }
  }
  const changeResponse = await services.route53.changeResourceRecordSets(changeParams).promise()
  console.dir(changeResponse)

  const waitParams = {
    Id: changeResponse.ChangeInfo.Id
  }
  const waitResponse = await services.route53.waitFor('resourceRecordSetsChanged', waitParams).promise()
  console.dir(waitResponse)
}

const updateDnsRecordSet = async (services, hostedZoneId, newPublicIp, dnsRecordSet) => {

  const dnsRecordSetClone = R.clone(dnsRecordSet)
  dnsRecordSetClone.ResourceRecords[0].Value = newPublicIp
  console.log(`resourceRecordSetClone: ${JSON.stringify(dnsRecordSetClone, null, 2)}`)

  const changeParams = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: dnsRecordSetClone
        }
      ]
    }
  }
  const changeResponse = await services.route53.changeResourceRecordSets(changeParams).promise()
  console.dir(changeResponse)

  const waitParams = {
    Id: changeResponse.ChangeInfo.Id
  }
  const waitResponse = await services.route53.waitFor('resourceRecordSetsChanged', waitParams).promise()
  console.dir(waitResponse)
}

const deleteDnsRecordSet = async (services, hostedZoneId, dnsRecordSet) => {

  const changeParams = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'DELETE',
          ResourceRecordSet: dnsRecordSet
        }
      ]
    }
  }
  const changeResponse = await services.route53.changeResourceRecordSets(changeParams).promise()
  console.dir(changeResponse)

  const waitParams = {
    Id: changeResponse.ChangeInfo.Id
  }
  const waitResponse = await services.route53.waitFor('resourceRecordSetsChanged', waitParams).promise()
  console.dir(waitResponse)
}

const doCreateOrUpdate = async services => {
  const taskArn = await findTask(services)
  const eni = await findEni(services, taskArn)
  const newPublicIp = await findNewPublicIp(services, eni)
  const hostedZoneId = await findHostedZoneId(services, 'simple-app-jt.com')
  const dnsRecordSet = await findDnsRecordSet(services, hostedZoneId)
  if (dnsRecordSet) {
    if (dnsRecordSet.AliasTarget) {
      console.log('DNS A record is an alias record - not updating!')
      return
    }
    const oldPublicIp = dnsRecordSet.ResourceRecords[0].Value
    console.log(`oldPublicIp: ${oldPublicIp}`)
    if (newPublicIp !== oldPublicIp) {
      await updateDnsRecordSet(services, hostedZoneId, newPublicIp, dnsRecordSet)
    }
  } else {
    await createDnsRecordSet(services, hostedZoneId, newPublicIp)
  }
}

const doDelete = async services => {
  const hostedZoneId = await findHostedZoneId(services, 'simple-app-jt.com')
  const dnsRecordSet = await findDnsRecordSet(services, hostedZoneId)
  if (dnsRecordSet) {
    if (dnsRecordSet.AliasTarget) {
      console.log('DNS A record is an alias record - not deleting!')
      return
    }
    await deleteDnsRecordSet(services, hostedZoneId, dnsRecordSet)
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
    const lastArg = process.argv.slice(-1)[0]
    if (['-d', '--delete'].includes(lastArg))
      await doDelete(services)
    else
      await doCreateOrUpdate(services)
  } catch (error) {
    console.log(`[main] error: ${error.message}`)
  }
}

main()
