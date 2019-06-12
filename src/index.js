import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import { Customizer } from 'office-ui-fabric-react'
import { FluentCustomizations } from '@uifabric/fluent-theme'
import LocalMediaContext from './contexts/LocalMediaContext'
import LocalMediaClient from './clients/LocalMediaClient'
import './i18n'
import createStore from './store/createStore'
import * as serviceWorker from './serviceWorker'
import './index.scss'

const initialState = window.__INITIAL_STATE__
const store = createStore(initialState)
const localMedia = new LocalMediaClient()

ReactDOM.render((
  <BrowserRouter>
    <Provider store={store}>
      <Customizer {...FluentCustomizations}>
        <LocalMediaContext.Provider value={localMedia}>
          <App />
        </LocalMediaContext.Provider>
      </Customizer>
    </Provider>
  </BrowserRouter>
), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
