import React from 'react'
import ReactDOM from 'react-dom'
import VisitTimeline from './VisitTimeline'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<VisitTimeline />, div)
  ReactDOM.unmountComponentAtNode(div)
})
