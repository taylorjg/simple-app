import axios from 'axios'

export const getWeatherInfo = async ids => {
  const response = await axios.get(`/api/weatherInfo/${ids.join(',')}`)
  return response.data
}
