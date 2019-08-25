import React from 'react';

import { Provider } from 'mcrel';
import { render } from 'react-dom';

import App from './components/App';
import { store } from './store';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
