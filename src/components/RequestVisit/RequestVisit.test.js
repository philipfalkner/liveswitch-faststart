import React from 'react'
import ReactDOM from 'react-dom'
import RequestVisit from './RequestVisit'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<RequestVisit />, div)
  ReactDOM.unmountComponentAtNode(div)
})
