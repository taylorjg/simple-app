const axios = require('axios')

const configure = apiKey => {

  const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org'
  })

  const getWeatherInfo = async ids => {
    const url = `/data/2.5/group`
    const config = {
      params: {
        appid: apiKey,
        id: ids.join(','),
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
