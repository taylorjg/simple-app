import axios from 'axios'
import { formatAxiosError } from '../utils'

export const search = async input => {
  try {
    const config = {
      params: {
        input
      }
    }
    const response = await axios.get('/api/search', config)
    return response.data
  } catch (error) {
    const baseMessage = 'An error occurred searching for auto-completion matches'
    const errorMessage = formatAxiosError(error, baseMessage)
    console.error(errorMessage)
    return ['-- Error --']
  }
}
