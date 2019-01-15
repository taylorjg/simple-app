const AWS = require('aws-sdk')
const R = require('ramda')

const CLUSTER_NAME = 'simple-app'

const main = async () => {
  try {
    const ecs = new AWS.ECS({ apiVersion: '2014-11-13' })
    const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' })
    const route53 = new AWS.Route53({ apiVersion: '2013-04-01' })

    const listTasksParams = {
      cluster: CLUSTER_NAME
    }
    const listTasksResponse = await ecs.listTasks(listTasksParams).promise()

    const taskArn = listTasksResponse.taskArns[0]
    console.log(`taskArn: ${taskArn}`)

    const describeTasksParams = {
      cluster: CLUSTER_NAME,
      tasks: [taskArn]
    }
    const describeTasksResponse = await ecs.describeTasks(describeTasksParams).promise()

    const attachmentsDetails = describeTasksResponse.tasks[0].attachments[0].details
    const eni = attachmentsDetails.find(d => d.name === 'networkInterfaceId').value
    console.log(`eni: ${eni}`)

    const describeNetworkInterfacesParams = {
      NetworkInterfaceIds: [eni]
    }
    const describeNetworkInterfacesResponse = await ec2.describeNetworkInterfaces(describeNetworkInterfacesParams).promise()
    const newPublicIp = describeNetworkInterfacesResponse.NetworkInterfaces[0].Association.PublicIp
    console.log(`newPublicIp: ${newPublicIp}`)

    const listHostedZonesByNameParams = {
      DNSName: 'simple-app-jt.com.'
    }
    const listHostedZonesByNameResponse = await route53.listHostedZonesByName(listHostedZonesByNameParams).promise()

    const hostedZoneId = listHostedZonesByNameResponse.HostedZones[0].Id
    console.log(`hostedZoneId: ${hostedZoneId}`)

    const listResourceRecordSetsParams = {
      HostedZoneId: hostedZoneId
    }
    const listResourceRecordSetsResponse = await route53.listResourceRecordSets(listResourceRecordSetsParams).promise()

    const resourceRecordSet = listResourceRecordSetsResponse.ResourceRecordSets.find(r => r.Type === 'A')
    console.log(`resourceRecordSet: ${JSON.stringify(resourceRecordSet, null, 2)}`)

    const oldPublicIp = resourceRecordSet.ResourceRecords[0].Value
    console.log(`oldPublicIp: ${oldPublicIp}`)

    if (newPublicIp !== oldPublicIp) {

      const resourceRecordSetClone = R.clone(resourceRecordSet)
      resourceRecordSetClone.ResourceRecords[0].Value = newPublicIp
      console.log(`resourceRecordSetClone: ${JSON.stringify(resourceRecordSetClone, null, 2)}`)

      const changeResourceRecordSetsParams = {
        HostedZoneId: hostedZoneId,
        ChangeBatch: {
          Changes: [
            {
              Action: 'UPSERT',
              ResourceRecordSet: resourceRecordSetClone
            }
          ]
        }
      }
      const changeResourceRecordSetsResponse = await route53.changeResourceRecordSets(changeResourceRecordSetsParams).promise()
      console.dir(changeResourceRecordSetsResponse)

      const waitParams = {
        Id: changeResourceRecordSetsResponse.ChangeInfo.Id
      }
      const waitResponse = await route53.waitFor('resourceRecordSetsChanged', waitParams).promise()
      console.dir(waitResponse)
    }
  } catch (error) {
    console.log(`[main] error: ${error.message}`)
  }
}

main()
