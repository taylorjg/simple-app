const R = require('ramda')
const formatLocation = require('./formatLocation')
const cityList = require('./city.list.json')

const groupLocations = (locations) => {
  const sortKvpsByKey = R.sortWith([R.ascend(([key]) => key)])
  const sortEntriesByCity = R.sortWith([R.ascend(entry => entry.city)])
  const mapValues = f => R.map(([key, value]) => [key, f(value)])
  const pipe = R.pipe(
    R.groupBy(entry => entry.country),
    R.toPairs,
    sortKvpsByKey,
    mapValues(sortEntriesByCity)
  )
  return pipe(locations)
}

const flatLocations =
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

const groupedLocations = groupLocations(flatLocations)

const getLocations = () => groupedLocations

const search = input => {
  const lowercaseInput = input.toLowerCase()
  return R.pipe(
    R.filter(entry => entry.lowercaseCity.includes(lowercaseInput)),
    R.sortWith([
      R.ascend(entry => entry.city.length),
      R.ascend(entry => entry.country)
    ]),
    R.take(5)
  )(flatLocations)
}

module.exports = {
  getLocations,
  search
}
