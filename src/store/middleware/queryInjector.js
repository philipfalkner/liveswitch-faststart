import qs from 'querystring'
import { RSAA } from 'redux-api-middleware'

export default function queryInjector () {
  return next => action => {
    if (action.hasOwnProperty(RSAA) && action[RSAA].hasOwnProperty('params')) {
      const request = action[RSAA]
      request.endpoint = [
        request.endpoint.replace(/\?*/, ''),
        qs.stringify(request.params)
      ].join('?')
      delete request.params

      return next({ [RSAA]: request })
    }

    return next(action)
  }
}
