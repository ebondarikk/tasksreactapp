import React from 'react';
import { Switch } from 'react-router-dom';
import { Routes as Home } from 'features/home';

export const Features = () => <Switch>{Home()}</Switch>;
