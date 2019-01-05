const path = require('path')
const express = require('express')
const weatherInfoApi = require('./api/weatherInfo')

const PORT = process.env.PORT || 3001
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY
const EXPOSE_ERROR_DETAILS = process.env.EXPOSE_ERROR_DETAILS

const publicFolder = path.join(__dirname, 'public')

const app = express()
app.use('/', express.static(publicFolder))
app.use('/api', weatherInfoApi.buildRouter(OPEN_WEATHER_API_KEY, EXPOSE_ERROR_DETAILS))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
