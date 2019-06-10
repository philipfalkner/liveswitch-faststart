import { RSAA } from 'redux-api-middleware'
import getCookie from '../../helpers/cookieHelpers'

export default store => next => action => {
  const callApi = action[RSAA]

  // Check if this action is a redux-api-middleware action.
  if (callApi) {
    // Inject the Authorization header from cookie.
    callApi.headers = Object.assign({}, callApi.headers, {
      Authorization: `Bearer ${getCookie('access_token') || ''}`
    })
  }

  // Pass the FSA to the next action.
  return next(action)
}
