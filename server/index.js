const path = require('path')
const express = require('express')
const history = require('connect-history-api-fallback')
const cookieParser = require('cookie-parser')
const weatherInfoApi = require('./api/weatherInfo')
const locationsApi = require('./api/locations')

const PORT = process.env.PORT || 3001
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY
const EXPOSE_ERROR_DETAILS = process.env.EXPOSE_ERROR_DETAILS

const publicFolder = path.join(__dirname, 'public')

const app = express()
app.use(history())
app.use(cookieParser())
app.use('/', express.static(publicFolder))

const weatherInfoApiRouter = weatherInfoApi.configureRouter(OPEN_WEATHER_API_KEY, EXPOSE_ERROR_DETAILS)
const locationsApiRouter = locationsApi.router

const apiRouters = [
  weatherInfoApiRouter,
  locationsApiRouter
]

app.use('/api', apiRouters)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
