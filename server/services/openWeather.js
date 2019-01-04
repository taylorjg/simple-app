const axios = require('axios')

const configure = apiKey => {

  const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org'
  })

  const makeImageUrl = icon =>
    `https://openweathermap.org/img/w/${icon}.png`

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
    const viewModel = response.data.list.map(weatherInfo => ({
      id: weatherInfo.id,
      country: weatherInfo.sys.country,
      city: weatherInfo.name,
      description: weatherInfo.weather[0].description,
      imageUrl: makeImageUrl(weatherInfo.weather[0].icon),
      currentTemp: weatherInfo.main.temp,
      minTemp: weatherInfo.main.temp_min,
      maxTemp: weatherInfo.main.temp_max
    }))
    return viewModel
  }

  return {
    getWeatherInfo
  }
}

module.exports = configure
