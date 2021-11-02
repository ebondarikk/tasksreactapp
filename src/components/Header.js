import React, { useState, useCallback, useMemo } from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import LoginDialog from 'components/LoginDialog';
import { connect } from 'react-redux';
import login from 'redux/auth/login';

const Header = ({ success, logout, dispatch }) => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  const handleOpenLoginDialog = useCallback(
    () => setOpenLoginDialog(true),
    [setOpenLoginDialog]
  );

  const handleCloseLoginDialog = useCallback(
    () => setOpenLoginDialog(false),
    [setOpenLoginDialog]
  );

  const authButtonName = useMemo(
    () => (success ? 'Logout' : 'Login'),
    [success]
  );

  const handleLogout = useCallback(
    () => dispatch(logout()),
    [dispatch, logout]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <LoginDialog
        open={openLoginDialog}
        handleClose={handleCloseLoginDialog}
      />
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h4' component='div' sx={{ flexGrow: 1 }}>
            Tasks App
          </Typography>
          <Button
            color='inherit'
            onClick={success ? handleLogout : handleOpenLoginDialog}
          >
            {authButtonName}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default connect(login.selectors)(Header);
