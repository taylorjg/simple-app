const express = require('express')
const service = require('../services/locations')

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
router.get('/search', search)

module.exports = {
  router
}
