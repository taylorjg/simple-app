const express = require('express')
const configure = require('../services/openWeather')

const buildRouter = apiKey => {

  const openWeather = configure(apiKey)

  const getWeatherInfo = async (req, res) => {
    try {
      const country = req.params.country
      const city = req.params.city
      console.log(`[getWeatherInfo] country: ${country}; city: ${city}`)
      const results = await openWeather.getWeatherInfo(country, city)
      res.json(results)
    }
    catch (error) {
      console.log(`[getWeatherInfo] ${error.stack}`)
      res.status(500).send(error.message || 'Internal Server Error')
    }
  }

  const getWeatherInfoMultiple = async (req, res) => {
    try {
      const ids = req.params.ids.split(',').map(s => s.trim())
      console.log(`[getWeatherInfoMultiple] ids: ${ids.join(',')}`)
      const results = await openWeather.getWeatherInfoMultiple(ids)
      res.json(results)
    }
    catch (error) {
      console.log(`[getWeatherInfoMultiple] ${error.stack}`)
      res.status(500).send(error.message || 'Internal Server Error')
    }
  }

  const router = express.Router()
  router.get('/weatherInfo/:country/:city', getWeatherInfo)
  router.get('/weatherInfoMultiple/:ids', getWeatherInfoMultiple)

  return router
}

module.exports = {
  buildRouter
}
