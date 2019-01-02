const express = require('express')
const configure = require('../services/openWeather')

const buildRouter = apiKey => {

  const openWeather = configure(apiKey)

  const getWeatherInfo = async (req, res) => {
    const country = req.params.country
    const city = req.params.city
    try {
      const results = await openWeather.getWeatherInfo(country, city)
      res.json(results)
    }
    catch (error) {
      console.log(`[getWeatherInfo(${country}, ${city})] ERROR | ${error.stack}`)
      res.status(500).send(error.message || 'Internal Server Error')
    }
  }
  
  const router = express.Router()
  router.get('/:country/:city', getWeatherInfo)
  
  return router
}

module.exports = {
  buildRouter
}
