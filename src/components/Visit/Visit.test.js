import React from 'react'
import ReactDOM from 'react-dom'
import Visit from './Visit'
import { render, cleanup } from 'react-testing-library'

// Suppress warning caused by a bug in React 16.8
const originalError = console.error

// Suppress warning caused by a bug in React 16.8
beforeAll(() => {  
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

// Suppress warning caused by a bug in React 16.8
afterAll(() => {
  console.error = originalError
})

afterEach(() => cleanup)

// Simulates window resize
function resizeWindow(width) {
  global.innerWidth = width;
  global.dispatchEvent(new Event('resize'));
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Visit />, div)
  ReactDOM.unmountComponentAtNode(div)
})
