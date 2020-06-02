import axios from 'axios'
import { formatAxiosError } from '../utils'

class AppError extends Error {}

export const getWeatherInfo = async ids => {
  try {
    const config = {
      params: {
        ids: ids.join(',')
      }
    }
    const response = await axios.get('/api/weatherInfo', config)
    const result = response.data
    if (result.success) {
      return result.success.results
    }
    throw new AppError(result.failure.errorMessage)
  } catch (error) {
    if (error instanceof AppError) throw error
    const baseMessage = 'An error occurred retrieving weather information from the server'
    const errorMessage = formatAxiosError(error, baseMessage)
    throw new Error(errorMessage)
  }
}
