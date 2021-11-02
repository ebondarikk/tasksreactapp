import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { capitalize } from 'lodash-es';
import {
  CircularProgress,
  Box,
  Pagination,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  Typography,
} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import TaskCard from 'components/TaskCard';
import { AddTaskDialog } from 'components/TaskDialog';
import { connect } from 'react-redux';
import taskslist from 'redux/tasks/list';
import {
  DIRECTION_ASC,
  DIRECTION_DESC,
  PAGE_SIZE,
  TASK_SORT_FIELDS,
} from 'consts';
import { useTasksSorting } from 'hooks';

import useStyles from './Page.styles';

const Page = ({ dispatch, request, results, loading, count }) => {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const { sortBy, setSortBy, direction, setDirection } = useTasksSorting();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleOpenAddDialog = useCallback(
    () => setOpenAddDialog(true),
    [setOpenAddDialog]
  );

  const handleCloseAddDialog = useCallback(
    () => setOpenAddDialog(false),
    [setOpenAddDialog]
  );

  const updateList = useCallback(
    () =>
      dispatch(
        request({ page, sort_field: sortBy, sort_direction: direction })
      ),
    [page, request, dispatch, sortBy, direction]
  );

  useEffect(() => {
    updateList();
  }, [updateList]);

  const handlePageChange = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );

  return (
    <Box className={classes.box} bgcolor='background.paper'>
      <AddTaskDialog
        open={openAddDialog}
        handleClose={handleCloseAddDialog}
        reload={updateList}
      />
      <Grid
        container
        direction='column'
        justifyContent='space-between'
        alignItems='center'
        spacing={2}
        className={classes.grid}
      >
        <Grid item container justifyContent='space-between'>
          <Grid item xs={12} md={2}>
            <IconButton
              color='secondary'
              className={classes.addButton}
              onClick={handleOpenAddDialog}
            >
              <AddCircleOutlineOutlinedIcon fontSize={'large'} />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={8} container justifyContent='center'>
            <Typography variant='h2'>Tasks</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={2}
            container
            spacing={2}
            justifyContent='end'
            alignItems='center'
          >
            <Grid item xs={8}>
              <FormControl variant='outlined' color='secondary' fullWidth>
                <InputLabel id='sortSelectLabel'>Sort by</InputLabel>
                <Select
                  labelId='sortSelectLabel'
                  value={sortBy}
                  label='Sort by'
                  onChange={useCallback(
                    (e) => setSortBy(e.target.value),
                    [setSortBy]
                  )}
                >
                  {TASK_SORT_FIELDS.map((f) => (
                    <MenuItem key={f} value={f}>
                      {capitalize(f)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Checkbox
                icon={<ArrowUpwardIcon color='secondary' />}
                checkedIcon={<ArrowDownwardIcon />}
                color='secondary'
                checked={useMemo(
                  () => direction === DIRECTION_DESC,
                  [direction]
                )}
                onChange={useCallback(
                  (e) =>
                    setDirection(
                      e.target.checked ? DIRECTION_DESC : DIRECTION_ASC
                    ),
                  [setDirection]
                )}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={6}
          container
          alignItems='stretch'
          justifyContent='space-evenly'
          spacing={3}
        >
          {loading ? (
            <CircularProgress size={80} />
          ) : (
            results.map((t) => (
              <Grid item xs={12} md={4} key={t.id}>
                <TaskCard value={t} reload={updateList} />
              </Grid>
            ))
          )}
        </Grid>
        <Grid item>
          <Pagination
            className={classes.pagination}
            color='secondary'
            size='large'
            page={page}
            onChange={handlePageChange}
            count={Math.ceil(count / PAGE_SIZE)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default connect(taskslist.selectors)(Page);
