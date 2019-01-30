const R = require('ramda')
const formatLocation = require('./formatLocation')
const cityList = require('./city.list.json')

const locations =
  R.pipe(
    R.map(entry => ({
      id: entry.id,
      city: entry.name,
      country: entry.country,
      location: formatLocation(entry.name, entry.country),
      lowercaseCity: entry.name.toLowerCase()
    })),
    R.uniqBy(entry => entry.location)
  )(cityList)

const search = (input, country) => {
  const lowercaseInput = input.toLowerCase()
  return R.pipe(
    R.filter(entry => entry.lowercaseCity.includes(lowercaseInput) && entry.country === country),
    R.sort(R.ascend(entry => entry.city)),
    R.take(20)
  )(locations)
}

module.exports = {
  search
}
