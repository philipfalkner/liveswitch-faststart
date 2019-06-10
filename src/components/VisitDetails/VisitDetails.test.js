import React from 'react'
import ReactDOM from 'react-dom'
import VisitDetails from './VisitDetails'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<VisitDetails />, div)
  ReactDOM.unmountComponentAtNode(div)
})
