import axios from 'axios'
import { formatAxiosError } from '../utils'
import * as log from 'loglevel'

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
    log.error(errorMessage)
    return []
  }
}
