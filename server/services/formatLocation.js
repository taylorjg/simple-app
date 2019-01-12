const formatLocation = (city, country) =>
  country ? `${city}, ${country}` : city

module.exports = formatLocation
