import { makeStyles } from '@material-ui/styles';

export default makeStyles(() => ({
  card: {
    borderRadius: '.7rem !important',
    boxShadow: '.3rem .3rem .2rem grey !important',
    position: 'relative',
    borderColor: 'rgba(140,42,14,0.8)',
    borderWidth: '.1rem',
    borderStyle: 'solid',
  },
  textBox: {
    margin: '1rem 0',
    overflow: 'auto',
    height: '10rem',
  },
}));
