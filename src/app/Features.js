import React from 'react';
import { Switch } from 'react-router-dom';
import Main from 'features/main';

export const Features = () => <Switch>{Main()}</Switch>;
