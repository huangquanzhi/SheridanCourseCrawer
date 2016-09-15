import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configStore from './app/store';
import 'babel-polyfill';
import 'es5-shim'
import App from './app/app.js';

const store = configStore();

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
