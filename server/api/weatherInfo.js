const express = require('express')
const configure = require('../services/openWeather')

const buildRouter = (apiKey, exposeErrorDetails) => {

  const openWeather = configure(apiKey, exposeErrorDetails)

  const getWeatherInfo = async (req, res) => {
    try {
      const ids = req.params.ids.split(',').map(s => s.trim())
      console.log(`[api.weatherInfo.getWeatherInfo] ids: ${ids.join(',')}`)
      const results = await openWeather.getWeatherInfo(ids)
      res.json(results)
    }
    catch (error) {
      console.log(`[api.weatherInfo.getWeatherInfo] ${error}`)
      res.status(500).send(error.message || 'Internal Server Error')
    }
  }

  const router = express.Router()
  router.get('/weatherInfo/:ids', getWeatherInfo)

  return router
}

module.exports = {
  buildRouter
}
