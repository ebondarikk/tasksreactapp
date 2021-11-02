import React, { useCallback, useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Box,
  Checkbox,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { EditTaskDialog } from './TaskDialog';
import { useStatus } from 'hooks';
import { connect } from 'react-redux';
import login from 'redux/auth/login';

import useStyles from './TaskCard.styles';

const TaskCard = ({ value, success, reload }) => {
  const classes = useStyles();
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const { isDone, isEdit } = useStatus(value);

  const handleOpenEditDialog = useCallback(
    () => setOpenEditDialog(true),
    [setOpenEditDialog]
  );

  const handleCloseEditDialog = useCallback(
    () => setOpenEditDialog(false),
    [setOpenEditDialog]
  );

  return (
    <Card elevation={0} sx={{ height: 350 }} className={classes.card}>
      <EditTaskDialog
        open={openEditDialog}
        handleClose={handleCloseEditDialog}
        value={value}
        reload={reload}
      />
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {value.email}
        </Typography>
        <Typography variant='h5' component='div'>
          {value.username}
        </Typography>
        <Box className={classes.textBox}>
          <Typography variant='body2'>{value.text}</Typography>
        </Box>
      </CardContent>
      <CardActions>
        {success && (
          <Button
            size='small'
            onClick={handleOpenEditDialog}
            variant='outlined'
          >
            Edit
          </Button>
        )}

        <Grid container justifyContent='end'>
          <Checkbox
            icon={<></>}
            checkedIcon={<EditIcon />}
            checked={isEdit}
            disabled
          />
          <Checkbox
            disabled
            icon={<></>}
            checkedIcon={<DoneIcon fontSize={'large'} color={'success'} />}
            color='success'
            checked={isDone}
          />
        </Grid>
      </CardActions>
    </Card>
  );
};

export default connect(login.selectors)(TaskCard);
