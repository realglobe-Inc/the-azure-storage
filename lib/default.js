/**
 * Default exports
 * @module default
 */
'use strict'

const create = require('./create')
const TheAzureStorage = require('./TheAzureStorage')

const lib = create.bind(create)

module.exports = Object.assign(lib, {
  TheAzureStorage,
  create,
})
