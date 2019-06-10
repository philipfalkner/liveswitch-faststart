import initialState from './initialState'
import actionHandlers from './actionHandlers'

export default function visitReducer (state = initialState, action) {
  const handler = actionHandlers[action.type]
  return handler ? handler(state, action) : state
}
