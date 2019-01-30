import axios from 'axios'
import { formatAxiosError } from '../utils'

export const search = async (input, country) => {
  try {
    if (!input) return []
    const config = {
      params: {
        input,
        country
      }
    }
    const response = await axios.get('/api/search', config)
    return response.data
  } catch (error) {
    const baseMessage = 'An error occurred searching for auto-completion matches'
    const errorMessage = formatAxiosError(error, baseMessage)
    throw new Error(errorMessage)
  }
}
