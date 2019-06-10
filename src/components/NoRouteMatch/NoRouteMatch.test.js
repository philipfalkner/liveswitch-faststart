import React from 'react';
import ReactDOM from 'react-dom';
import NoRouteMatch from './NoRouteMatch';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NoRouteMatch />, div);
  ReactDOM.unmountComponentAtNode(div);
});
