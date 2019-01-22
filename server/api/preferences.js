const express = require('express')
const service = require('../services/preferences')

const PREFERENCES_ID_COOKIE_NAME = 'preferences-id'

const getPreferences = (req, res) => {
  try {
    const preferencesId = req.cookies[PREFERENCES_ID_COOKIE_NAME]
    console.log(`[api.preferences.getPreferences] preferencesId: ${preferencesId}`)
    const results = service.getPreferences(preferencesId)
    res.json(results)
  } catch (error) {
    console.log(`[api.preferences.getPreferences] ${error}`)
    res.status(500).send(error.message || 'Internal Server Error')
  }
}

const router = express.Router()
router.get('/preferences', getPreferences)

module.exports = {
  router
}
