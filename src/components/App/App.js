import React, { Suspense, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import ErrorPage from '../ErrorPage'
import Visits from '../Visits'
import Visit from '../Visit'
import RequestVisit from '../RequestVisit'
import NoRouteMatch from '../NoRouteMatch'
import './App.scss'

function App (props) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    Promise.all([
      props.getAppConfiguration()
    ]).catch(() => {
      setHasError(true)
    }).then(() => {
      console.log('here')
    })
  }, [])

  if (hasError) {
    return (
      <Suspense fallback={<p>Loading</p>}>
        <ErrorPage />
      </Suspense>
    )
  } else {
    return (
      <div className="app">
        <Suspense fallback={<p>Loading</p>}>
          <Switch>
            <Route exact path='/' render={() => (
              <Redirect to = '/visits' />
            )} />
            <Route exact path={'/visits/:visitId'} component={Visit}/>  
            <Route path='/visits' component={Visits}/>
            <Route path='/request-visit' component={RequestVisit}/>
            <Route component={NoRouteMatch}/>
          </Switch>
        </Suspense>
      </div>
    )
  }
}

App.propTypes = {
  getAppConfiguration: PropTypes.func
}

export default App
