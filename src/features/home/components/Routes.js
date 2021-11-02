import React from 'react';
import { Route } from 'react-router-dom';
import Page from './Page';

export const URLs = '';

export const Routes = () => {
  return [
    <Route key='home' path='/' render={(props) => <Page {...props} />} />,
  ];
};
