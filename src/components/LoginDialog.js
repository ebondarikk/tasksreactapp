import React, { useCallback, useMemo } from 'react';
import {
  Grid,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
} from '@mui/material';
import { useLogin } from 'hooks';
import { LOGIN_SUCCESS } from 'consts';
import { loginValidationSchema } from 'validators';
import { Form } from './Form';
import { Field } from './Field';
import { connect } from 'react-redux';
import login from 'redux/auth/login';

import useStyles from './LoginDialog.styles';

const LoginDialog = ({
  open,
  handleClose,
  dispatch,
  loading,
  errors,
  request,
}) => {
  const classes = useStyles();
  const creds = useLogin(errors);

  const handleCloseWithClear = useCallback(() => {
    creds.clear();
    handleClose();
  }, [creds, handleClose]);

  const handleSubmit = useCallback(() => {
    dispatch(
      request({
        credentials: creds,
        confirmation: LOGIN_SUCCESS,
        closeDialog: handleCloseWithClear,
      })
    );
  }, [dispatch, request, creds, handleCloseWithClear]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Form
        submit={handleSubmit}
        value={creds}
        schema={useMemo(() => loginValidationSchema, [])}
      >
        <Box className={classes.title}>
          <Typography variant='h4'>Login</Typography>
        </Box>
        <DialogContent className={classes.content}>
          <Grid container direction='column'>
            <Field
              component={TextField}
              label='Username'
              source={creds.username}
              fullWidth
            />
            <Field
              fullWidth
              component={TextField}
              label='Password'
              type='password'
              source={creds.password}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' fullWidth>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={loading}
          >
            Login
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default connect(login.selectors)(LoginDialog);
