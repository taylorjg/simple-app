const R = require('ramda')
const cityList = require('./city.list.json')

const initialiseLocations = () => {
  console.log('[initialiseLocations]')
  const sortKvpsByKey = R.sortWith([R.ascend(([key]) => key)])
  const sortObjectsByCity = R.sortWith([R.ascend(object => object.city)])
  const transformObject = object => ({
    id: object.id,
    location: `${object.name}, ${object.country}`,
    city: object.name,
    country: object.country
  })
  const transformAndSortObjects = R.compose(
    sortObjectsByCity,
    R.uniqBy(object => object.city),
    R.map(transformObject))
  const transformAndSortValues = ([key, value]) => [key, transformAndSortObjects(value)]
  const pipe = R.pipe(
    R.groupBy(object => object.country),
    R.toPairs,
    sortKvpsByKey,
    R.map(transformAndSortValues)
  )
  return pipe(cityList)
}

let locations = null

const getLocations = () => {
  if (!locations) {
    locations = initialiseLocations()
  }
  return locations
}

module.exports = {
  getLocations
}
