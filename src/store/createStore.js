import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import makeRootReducer from './rootReducer'
import { apiMiddleware } from 'redux-api-middleware'
import queryInjector from './middleware/queryInjector'
import apiAuthInjector from './middleware/apiAuthInjector'
import attachCookies from './middleware/attachCookies'
import apiError from './middleware/apiError'

export default (initialState = {}) => {
  const middleware = [
    thunk,
    apiMiddleware,
    queryInjector,
    apiAuthInjector,
    attachCookies,
    apiError
  ]

  const enhancers = []
  let composeEnhancers = compose
  
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    if (typeof composeWithDevToolsExtension === 'function') {
      composeEnhancers = composeWithDevToolsExtension
    }
  }

  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const reducers = require('./rootReducer').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
