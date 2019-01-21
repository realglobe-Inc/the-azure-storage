/**
 * @class TheAzureStorage
 * @param {string} account - Azure account
 * @param {string} accessKey - Azure access key
 * @param {Object} [options={}]
 */
'use strict'

const azure = require('azure-storage')
const mime = require('mime')
const path = require('path')
const { format: formatUrl } = require('url')
const uuid = require('uuid')
const { unlinkAsync } = require('asfs')
const { publicReadPolicy } = require('./policies')

/** @lends TheAzureStorage */
class TheAzureStorage {
  constructor (account, accessKey, options = {}) {
    this.blobService = azure.createBlobService(account, accessKey)
  }

  /**
   * Upload local file to azure storage
   * @param {string} src - Filename to upload
   * @param {Object} [options={}] - Optional settings
   * @returns {Promise<{url: string}>}
   */
  async upload (src, options = {}) {
    const {
      as: blobName = `${uuid.v4()}-${path.basename(src)}`,
      cdn = null,
      container = 'the-azure-storage',
      policy = publicReadPolicy(),
      type = null,
      cleanup = false,
    } = options
    const contentType = type || (
      typeof src === 'string' ? mime.getType(src) : null
    )
    const { blobService } = this
    await new Promise((resolve, reject) => {
      blobService.createBlockBlobFromLocalFile(
        container,
        blobName,
        path.resolve(src),
        {
          contentSettings: {
            contentType,
          },
        },
        (err, result) => err ? reject(err) : resolve(result)
      )
    })
    const token = blobService.generateSharedAccessSignature(
      container,
      blobName,
      policy,
    )
    const pathname = `${container}/${blobName}`
    const url = formatUrl({
      hostname: cdn,
      pathname,
      protocol: 'https:',
      search: token,
    })
    if (cleanup) {
      await unlinkAsync(src)
    }
    return {
      pathname,
      token,
      url,
    }
  }
}

module.exports = TheAzureStorage
