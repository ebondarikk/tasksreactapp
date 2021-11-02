import React, { useCallback, useMemo, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Checkbox from '@mui/material/Checkbox';
import { useTask, useStatus } from 'hooks';
import { TASK_ADDED_SUCCESS, TASK_EDITED_SUCCESS } from 'consts';
import { taskValidationSchema } from 'validators';
import { Form } from './Form';
import { Field } from './Field';
import { Grid, Typography, Box, FormControlLabel } from '@mui/material';
import { connect, useDispatch, useSelector } from 'react-redux';
import { create, edit } from 'redux/tasks/item';
import login from 'redux/auth/login';

import useStyles from './TaskDialog.styles';

const TaskDialog = ({
  open,
  handleClose,
  dispatch,
  loading,
  errors,
  request,
  reload,
  value = null,
  confirmationMessage,
  requestProps = {},
}) => {
  const classes = useStyles();

  const task = useTask(value, errors);
  const { status, isDone, setIsDone, isEdit, setIsEdit } = useStatus(value);

  useEffect(() => task.status.set(status), [status, task]);

  const handleCloseWithClear = useCallback(() => {
    task.clear();
    handleClose();
  }, [task, handleClose]);

  const handleSubmit = useCallback(() => {
    dispatch(
      request({
        item: task,
        id: value?.id,
        confirmation: confirmationMessage,
        reload,
        closeDialog: handleCloseWithClear,
        ...requestProps,
      })
    );
  }, [
    dispatch,
    request,
    task,
    handleCloseWithClear,
    reload,
    value?.id,
    requestProps,
    confirmationMessage,
  ]);

  const handleStatusChange = useCallback(
    (e) => setIsDone(e.target.checked),
    [setIsDone]
  );

  const handleTextChange = useCallback(() => {
    if (value?.text && !isEdit && task.text.value !== value.text) {
      setIsEdit(true);
    }
  }, [isEdit, task, value, setIsEdit]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Form
        submit={handleSubmit}
        value={task}
        schema={useMemo(() => taskValidationSchema, [])}
      >
        <Box className={classes.title}>
          <Typography variant='h4'>
            {!!value ? 'Edit Task' : 'Add New Task'}
          </Typography>
        </Box>
        <DialogContent className={classes.content}>
          <Grid container direction='column'>
            {!value && (
              <>
                <Field
                  component={TextField}
                  label='Email'
                  source={task.email}
                  fullWidth
                />
                <Field
                  component={TextField}
                  label='Username'
                  source={task.username}
                  fullWidth
                />
              </>
            )}
            <Field
              component={TextField}
              onChange={handleTextChange}
              source={task.text}
              label={'Text'}
              multiline
              rows={5}
              fullWidth
            />
            {value && (
              <FormControlLabel
                className={classes.field}
                control={
                  <Checkbox checked={isDone} onChange={handleStatusChange} />
                }
                label='Completed'
              />
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' fullWidth>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            fullWidth
          >
            Save
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const AddTask = ({ ...props }) => {
  return <TaskDialog {...props} confirmationMessage={TASK_ADDED_SUCCESS} />;
};

const EditTask = ({ ...props }) => {
  const dispatch = useDispatch();
  const { logout } = useSelector(login.selectors);

  const handleLogout = useCallback(
    () => dispatch(logout()),
    [dispatch, logout]
  );

  return (
    <TaskDialog
      {...props}
      requestProps={{ logout: handleLogout }}
      confirmationMessage={TASK_EDITED_SUCCESS}
    />
  );
};

export const AddTaskDialog = connect(create.selectors)(AddTask);

export const EditTaskDialog = connect(edit.selectors)(EditTask);
