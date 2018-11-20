/**
 * @class TheAzureStorage
 * @param {string} account - Azure account
 * @param {string} accessKey - Azure access key
 * @param {Object} [options={}]
 */
'use strict'

const azure = require('azure-storage')
const path = require('path')
const { format: formatUrl } = require('url')
const uuid = require('uuid')
const { publicReadPolicy } = require('./policies')

/** @lends TheAzureStorage */
class TheAzureStorage {
  constructor (account, accessKey, options = {}) {
    this.blobService = azure.createBlobService(account, accessKey)
  }

  /**
   * Upload local file to azure storage
   * @param {string} filename - Filename to upload
   * @param {Object} [options={}] - Optional settings
   * @returns {Promise<{url: string}>}
   */
  async upload (filename, options = {}) {
    const {
      as: blobName = `${uuid.v4()}-${path.basename(filename)}`,
      cdn = null,
      container = 'the-azure-storage',
      policy = publicReadPolicy(),
    } = options
    const { blobService } = this
    await new Promise((resolve, reject) => {
      blobService.createBlockBlobFromLocalFile(
        container,
        blobName,
        path.resolve(filename),
        (err, result) => err ? reject(err) : resolve(result)
      )
    })
    const token = blobService.generateSharedAccessSignature(
      container,
      blobName,
      policy,
    )
    const url = formatUrl({
      hostname: cdn,
      pathname: `${container}/${blobName}`,
      protocol: 'https:',
      search: token,
    })
    return { url }
  }
}

module.exports = TheAzureStorage
