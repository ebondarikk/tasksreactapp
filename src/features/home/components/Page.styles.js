import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => ({
  box: {
    margin: '3rem',
    borderRadius: '.7rem',
    boxShadow: '.3rem .3rem 1.2rem grey',
    padding: '2rem',
    position: 'relative',
    minHeight: '40rem',
  },

  pagination: {
    display: 'flex',
    placeContent: 'center',
  },

  stack: {
    margin: '2rem',
  },

  grid: {
    minHeight: '40rem',
  },
}));
