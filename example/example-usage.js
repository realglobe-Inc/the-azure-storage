'use strict'

const { TheAzureStorage } = require('the-azure-storage')

async function tryExample () {
  const storage = new TheAzureStorage('account__xxxxx', 'accessKey__xxxxxx', {})
  await storage.update('hoge.txt', {
    as: 'hoge.txt',
  })
}

tryExample().catch((err) => console.error(err))
