const axios = require('axios')

const configure = apiKey => {

  const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org'
  })

  const getWeatherInfo = async (country, city) => {
    const url = `/data/2.5/weather`
    const config = {
      params: {
        APPID: apiKey,
        q: `${city},${country}`,
        units: 'metric'
      }
    }
    const response = await axiosInstance.get(url, config)
    return response.data
  }

  return {
    getWeatherInfo
  }
}

module.exports = configure
