import { RSAA } from 'redux-api-middleware'
import * as constants from './constants'

export const getAppConfiguration = () => ({
  [RSAA]: {
    endpoint: '/api/v1/config',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    types: [
      constants.GET_APP_CONFIGURATION_REQUEST,
      constants.GET_APP_CONFIGURATION_SUCCESS,
      constants.GET_APP_CONFIGURATION_FAILURE
    ]
  }
})
