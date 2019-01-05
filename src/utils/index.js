export const formatAxiosError = (error, baseMessage) =>
  error && error.response && error.response.status && error.response.statusText
    ? `${baseMessage} (${error.response.status} ${error.response.statusText}).`
    : `${baseMessage} (${error.message}).`
