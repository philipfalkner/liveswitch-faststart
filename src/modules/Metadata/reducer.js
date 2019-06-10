import initialState from './initialState'
import actionHandlers from './actionHandlers'

export default function metadataReducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
