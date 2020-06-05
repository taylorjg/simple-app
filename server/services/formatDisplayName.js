const formatDisplayName = (city, country) =>
  country ? `${city}, ${country}` : city

module.exports = formatDisplayName
