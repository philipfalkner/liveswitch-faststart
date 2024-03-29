import { combineReducers } from 'redux'
import appReducer from '../modules/App/reducer'
import liveswitchReducer from '../modules/Liveswitch/reducer'
import metadataReducer from '../modules/Metadata/reducer'
import visitsReducer from '../modules/Visits/reducer'
import visitReducer from '../modules/Visit/reducer'

const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    app: appReducer,
    liveswitch: liveswitchReducer,
    metadata: metadataReducer,
    visits: visitsReducer,
    visit: visitReducer,
    ...asyncReducers
  })
}

export default makeRootReducer
