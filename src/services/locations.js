import axios from 'axios'

let locations = null

export const getCountries = async () => {
  if (!locations) {
    const response = await axios.get('/api/locations')
    locations = response.data
  }
  return locations
}
