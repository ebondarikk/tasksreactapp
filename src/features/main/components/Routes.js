import React from 'react';
import { Route } from 'react-router-dom';
import { URLs as homeURLs } from 'features/home';
import { Page } from './Page';

const routes = [homeURLs, 'test'].join('|');

export const Routes = () => {
  return [<Route key='main' exact path={`/(${routes})`} component={Page} />];
};
