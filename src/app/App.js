import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Features } from './Features';

const App = ({ store, history }) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Features />
        <ToastContainer />
      </Router>
    </Provider>
  );
};

export default App;
