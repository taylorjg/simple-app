const express = require('express')
const service = require('../services/locations')

const getLocations = (_, res) => {
  console.log('[api.locations.getLocations]')
  const results = service.getLocations()
  res.json(results)
}

const router = express.Router()
router.get('/locations', getLocations)

module.exports = {
  router
}
