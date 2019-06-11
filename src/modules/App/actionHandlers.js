import * as constants from './constants'
import * as apiHelpers from '../../helpers/apiActionHelpers'

const actionHandlers = {
  [constants.GET_APP_CONFIGURATION_SUCCESS]: (state, action) => {
    return apiHelpers.requestSuccessHandler(state, action, {
      configuration: action.payload
    })
  }
}

export default actionHandlers
