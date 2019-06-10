import React from 'react'
import ReactDOM from 'react-dom'
import VisitHeader from './VisitHeader'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<VisitHeader />, div)
  ReactDOM.unmountComponentAtNode(div)
})

it('renders the participants section', () => {
  const div = document.createElement('div')
  ReactDOM.render(<VisitHeader />, div)
  let participantsElements = div.getElementsByClassName('participants')
  expect(participantsElements.length).toBe(1)
})

it('renders the call actions section', () => {
  const div = document.createElement('div')
  ReactDOM.render(<VisitHeader />, div)
  let callActionElements = div.getElementsByClassName('call-actions')
  expect(callActionElements.length).toBe(1)
})

it('renders the actions section', () => {
  const div = document.createElement('div')
  ReactDOM.render(<VisitHeader />, div)
  let actionsElements = div.getElementsByClassName('actions')
  expect(actionsElements.length).toBe(1)
})
