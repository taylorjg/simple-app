const path = require('path')
const express = require('express')
const weatherInfoApi = require('./api/weatherInfo')

const PORT = process.env.PORT || 3001
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY

const publicFolder = path.join(__dirname, 'public')

const app = express()
app.use('/', express.static(publicFolder))
app.use('/api', weatherInfoApi.buildRouter(OPEN_WEATHER_API_KEY))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
