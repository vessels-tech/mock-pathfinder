'use strict'

const Moment = require('moment')

const AttributeNamespace = 'http://www.neustar.biz/sip_ix/prov'

exports.build = (returnCode, transactionId, messages, data) => {
  let result = {
    'TransactionID': buildNode(transactionId),
    'ReturnCode': buildNode(returnCode),
    'TextMessage': addDateMessage(messages).map(m => buildNode(m))
  }

  if (data) {
    result['ResponseData'] = addNamespaceAttribute(data)
  }

  return result
}

const addDateMessage = (messages) => {
  let formattedDate = Moment.utc().format('ddd MMM DD HH:mm:ss [GMT] YYYY')
  return messages.concat(`Date: ${formattedDate}`)
}

const buildNode = (value) => {
  let node = { $value: value }
  return addNamespaceAttribute(node)
}

const addNamespaceAttribute = (data) => {
  let node = Object.assign({}, data)
  if (!node['attributes']) {
    node['attributes'] = {}
  }
  node['attributes']['xmlns'] = AttributeNamespace
  return node
}
