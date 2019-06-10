export default store => next => action => {
  // Checks to see if the action has a payload and if the payload is an ApiError
  if (action.payload && action.payload.name === 'ApiError') {
    if (action.payload.status === 403) {
      // 403 Forbidden means the request is not allowed within our current authentication context
      if (action.error && action.meta && typeof action.meta.errorHandler === 'function') {
        // The caller specified an error handler, so call it
        store.dispatch(action.meta.errorHandler(action))
      } else {
        // No error handler is available, so just pass to the next middleware
        return next(action)
      }
    } else if (action.payload.status === 401) {
      // 401 Unauthorized means the request requires authentication; direct the user to get authenticated
      window.location.replace('/Account/SignOut/')
    } else {
      // Pass any other status to the next middleware
      return next(action)
    }
  } else {
    // So the middleware doesn't get applied to every single action
    return next(action)
  }
}
