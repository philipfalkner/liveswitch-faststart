import { RSAA } from 'redux-api-middleware'

export default function attachCookies () {
  return next => action => {
    if (action.hasOwnProperty(RSAA) && !(action[RSAA].hasOwnProperty('credentials'))) {
      const request = action[RSAA]
      request.credentials = 'same-origin'

      return next({ [RSAA]: request })
    }

    return next(action)
  }
}
