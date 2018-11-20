/**
 * Create public read policy
 * @function publicReadPolicy
 * @returns {Object}
 */
'use strict'

const azure = require('azure-storage')
const moment = require('moment')

/** @lends publicReadPolicy */
function publicReadPolicy (options = {}) {
  const { maxYear = 10 } = options
  const startDate = moment().subtract(1, 'hour').toDate()
  const expiryDate = moment().add(maxYear, 'year').toDate()
  return {
    AccessPolicy: {
      Expiry: expiryDate,
      Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
      Start: startDate,
    },
  }
}

module.exports = publicReadPolicy
