const R = require('ramda')
const cityList = require('./city.list.json')

const initialiseLocations = () => {
  console.log('[initialiseLocations]')
  const sortKvpsByKey = R.sortWith([R.ascend(([key]) => key)])
  const sortObjectsByCity = R.sortWith([R.ascend(object => object.city)])
  const transformObject = object => ({
    id: object.id,
    city: object.name,
    country: object.country
  })
  const transformAndSortObjects = R.compose(sortObjectsByCity, R.map(transformObject))
  const transformAndSortValues = ([key, value]) => [key, transformAndSortObjects(value)]
  const pipe = R.pipe(
    R.groupBy(object => object.country),
    R.toPairs,
    sortKvpsByKey,
    R.map(transformAndSortValues)
  )
  return pipe(cityList)
}

let LOCATIONS = null

const getLocations = () => {
  if (!LOCATIONS) {
    LOCATIONS = initialiseLocations()
  }
  return LOCATIONS
}

module.exports = {
  getLocations
}
