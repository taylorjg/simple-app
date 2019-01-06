const axios = require('axios')

const configure = (apiKey, exposeErrorDetails) => {

  const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org'
  })

  const BASE_PARAMS = {
    appid: apiKey,
    units: 'metric'
  }

  const getWeatherInfo = async ids => {
    try {
      const url = `/data/2.5/group`
      const config = configWithAdditionalParams({
        id: ids.join(',')
      })
      const response = await axiosInstance.get(url, config)
      const openWeatherResults = response.data.list
      return {
        success: {
          results: openWeatherResults.map(openWeatherResultToViewModelResult)
        }
      }
    } catch (error) {
      const [errorMessage, clientErrorMessage] = getOpenWeatherErrorMessage(error)
      console.error(`[services.openWeather.getWeatherInfo] ${errorMessage}`)
      return {
        failure: {
          errorMessage: clientErrorMessage
        }
      }
    }
  }

  const openWeatherResultToViewModelResult = openWeatherResult => ({
    id: openWeatherResult.id,
    country: openWeatherResult.sys.country,
    location: `${openWeatherResult.name}, ${openWeatherResult.sys.country}`,
    city: openWeatherResult.name,
    description: openWeatherResult.weather[0].description,
    imageUrl: makeImageUrl(openWeatherResult.weather[0].icon),
    currentTemp: openWeatherResult.main.temp,
    minTemp: openWeatherResult.main.temp_min,
    maxTemp: openWeatherResult.main.temp_max,
    humidity: openWeatherResult.main.humidity,
    pressure: openWeatherResult.main.pressure,
    windSpeed: openWeatherResult.wind.speed
  })

  const makeImageUrl = icon =>
    `https://openweathermap.org/img/w/${icon}.png`

  const configWithAdditionalParams = params => ({
    params: {
      ...BASE_PARAMS,
      ...params
    }
  })

  const getOpenWeatherErrorMessage = error => {
    const baseMessage = 'A back end error occurred invoking the OpenWeather API'
    const response = error.response
    const detailedErrorMessage =
      response && response.status && response.data && response.data.message
        ? `${baseMessage} (${response.status} ${response.data.message}).`
        : response && response.status && response.statusText
          ? `${baseMessage} (${response.status} ${response.statusText}).`
          : `${baseMessage} (${error.message}).`
    const clientErrorMessage = exposeErrorDetails
      ? detailedErrorMessage
      : `${baseMessage}.`
    return [detailedErrorMessage, clientErrorMessage]
  }

  return {
    getWeatherInfo
  }
}

module.exports = configure
