const preferencesDictionary = {}

const getPreferences = preferencesId => {
  try {
    const preferences = preferencesDictionary[preferencesId]
    if (preferences) {
      return {
        success: {
          results: preferences
        }
      }
    }
    throw new Error(`Failed to find preferences for preferencesId, '${preferencesId}'.`)
  } catch (error) {
    const errorMessage = error.message
    console.error(`[services.preferences.getPreferences] ${errorMessage}`)
    return {
      failure: {
        errorMessage
      }
    }
  }
}

module.exports = {
  getPreferences
}
