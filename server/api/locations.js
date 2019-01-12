const express = require('express')
const service = require('../services/locations')

const getLocations = (_, res) => {
  try {
    console.log('[api.locations.getLocations]')
    const results = service.getLocations()
    res.json(results)
  } catch (error) {
    console.log(`[api.locations.getLocations] ${error}`)
    res.status(500).send(error.message || 'Internal Server Error')
  }
}

const search = (req, res) => {
  try {
    const input = req.query['input']
    console.log(`[api.locations.search] input: ${input}`)
    const results = service.search(input)
    res.json(results)
  } catch (error) {
    console.log(`[api.locations.search] ${error}`)
    res.status(500).send(error.message || 'Internal Server Error')
  }
}

const router = express.Router()
router.get('/locations', getLocations)
router.get('/search', search)

module.exports = {
  router
}
