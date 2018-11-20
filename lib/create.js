/**
 * Create a TheAzureStorage instance
 * @function create
 * @param {...*} args
 * @returns {TheAzureStorage}
 */
'use strict'

const TheAzureStorage = require('./TheAzureStorage')

/** @lends create */
function create (...args) {
  return new TheAzureStorage(...args)
}

module.exports = create
