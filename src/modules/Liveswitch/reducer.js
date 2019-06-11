import initialState from './initialState'
import actionHandlers from './actionHandlers'

export default function liveswitchReducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
