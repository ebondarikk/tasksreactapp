import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Features } from './Features';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: 'rgba(140,42,14,0.8)',
      light: '#512da8',
      contrastText: '#f7f7f7',
    },
    secondary: {
      main: '#f39808',
    },
    background: {
      default: '#ad806e',
      paper: '#ece1d5',
    },
  },
});

const App = ({ store, history }) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <Features />
          <ToastContainer />
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
