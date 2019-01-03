import axios from 'axios'

export const getWeatherInfo = async (country, city) => {
  const response = await axios.get(`/api/weatherInfo/${country}/${city}`)
  return response.data
}
