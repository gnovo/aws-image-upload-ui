import { createStore, applyMiddleware, compose } from 'redux'

import clientMiddleware from './middlewares/clientMiddleware'

import ApiClient from './client'
import rootReducer from './reducers'

const client = new ApiClient()

const enhancers = []
const middleware = [
  clientMiddleware(client),
]

if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)
export function initializeStore (initialState = {}) {
  return createStore(rootReducer, initialState, composedEnhancers)
}
