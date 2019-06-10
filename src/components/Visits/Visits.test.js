import React from 'react'
import ReactDOM from 'react-dom'
import Visits from './Visits'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Visits />, div)
  ReactDOM.unmountComponentAtNode(div)
})
