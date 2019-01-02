const axios = require('axios')

const configure = apiKey => {

  const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org'
    // TODO: can we add a header here rather than include APPID={apiKey} in every URL ?
  })

  const getWeatherInfo = async (country, city) => {
    const url = `/data/2.5/weather?q=${city},${country}&APPID=${apiKey}`
    const response = await axiosInstance.get(url)
    return response.data
  }

  return {
    getWeatherInfo
  }
}

module.exports = configure
