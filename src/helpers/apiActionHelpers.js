export const BACKEND_FAILURE = 'BACKEND_FAILURE'

export const requestStartedHandler = (state, action, payload) => {
  if (action.error) {
    switch (action.payload.name) {
      case 'InvalidRSAA':
        // Invalid request (malformed RSAA [Redux Standard API-calling Action])
        break
      case 'RequestError':
        // Error with request (network issue, server returned error, etc)
        // error message will be in action.payload.message
        break
      default:
        break;
    }
    return state
  } else {
    // Request has started.  Mark fetching true (this allows us to show a loader on screen)
    return { ...state, ...payload }
  }
}

export const requestSuccessHandler = (state, action, payload) => {
  // Is it a true success? Or did a failure occur in the backend?
  if (action.payload && (typeof (action.payload.Success) !== 'undefined' && action.payload.Success === false)) {
    action.type = BACKEND_FAILURE
  }
  return { ...state, ...payload }
}

// Handler to handle external requests.
export const externalRequestSuccessHandler = (state, action, payload) => {
  return { ...state, ...payload }
}

export const requestFailureHandler = (state, action, payload) => {
// api call returned response outside 200 range
// action.error will be true
// action.payload: will contain ApiError object containing the message `${status} - ${statusText}`
  return { ...state, ...payload }
}
