import React from 'react';
import { Container } from '@mui/material';
import { Header } from 'components';
import { Features } from './Features';

import useStyles from './Page.styles';

export const Page = () => {
  const classes = useStyles();
  return (
    <>
      <Header />
      <Container component='main' className={classes.main} maxWidth={'xl'}>
        <Features />
      </Container>
    </>
  );
};
