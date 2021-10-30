import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { store, history } from './store';
import App from './app/App';

ReactDOM.render(
  <React.StrictMode>
    <App store={store} history={history} />
  </React.StrictMode>,
  document.getElementById('root')
);
