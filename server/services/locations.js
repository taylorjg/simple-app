const R = require('ramda')
const formatDisplayName = require('./formatDisplayName')
const cityList = require('./city.list.json')

const locations =
  R.pipe(
    R.map(entry => ({
      id: entry.id,
      city: entry.name,
      country: entry.country,
      displayName: formatDisplayName(entry.name, entry.country)
    })),
    R.uniqBy(entry => entry.displayName)
  )(cityList)

const search = (input, country) => {
  const lowercaseInput = input.toLowerCase()
  return R.pipe(
    R.filter(entry => entry.city.toLowerCase().includes(lowercaseInput) && entry.country === country),
    R.sort(R.ascend(entry => entry.city)),
    R.take(20)
  )(locations)
}

module.exports = {
  search
}
