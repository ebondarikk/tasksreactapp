import list from './tasks/list';
import { create, edit } from './tasks/item';
import login from './auth/login';
import toast from 'components/Toast';

export default {
  reducers: {
    ...list.reducers,
    ...create.reducers,
    ...edit.reducers,
    ...login.reducers,
  },
  sagas: [list.sagas, create.sagas, edit.sagas, toast.sagas, login.sagas],
};
