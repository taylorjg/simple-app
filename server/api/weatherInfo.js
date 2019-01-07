const express = require('express')
const configureService = require('../services/openWeather')

const configureRouter = (apiKey, exposeErrorDetails) => {

  const service = configureService(apiKey, exposeErrorDetails)

  const getWeatherInfo = async (req, res) => {
    try {
      const ids = req.params.ids.split(',').map(s => s.trim())
      console.log(`[api.weatherInfo.getWeatherInfo] ids: ${ids.join(',')}`)
      const results = await service.getWeatherInfo(ids)
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
  configureRouter
}
