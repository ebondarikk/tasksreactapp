import { createSelector } from 'reselect';
import { put, takeLatest, call } from 'redux-saga/effects';
import { ERROR_RESPONSE_STATUS, OK_RESPONSE_STATUS } from 'consts';
import api from 'api';
import {
  REQUEST,
  SUCCESS,
  FAILURE,
  newFailure,
  newRequestConstants,
  newRequestActions,
  newPostReducer,
  Module,
  getFormData,
} from 'redux/utils';
import toast from 'components/Toast';
import storage from 'storage';

const newTaskPostModule = ({ store, state, endpoint }) => {
  const constants = newRequestConstants(`app/tasks/${store}`);
  const actions = newRequestActions(constants);
  const reducer = newPostReducer(constants);

  function* execute({
    _,
    data: { confirmation, reload, closeDialog, ...props },
  }) {
    try {
      const resp = yield* endpoint(props);
      const data = yield resp.data;
      if (data.status === OK_RESPONSE_STATUS) {
        yield put(toast.success(confirmation));
        yield put(actions[SUCCESS]());
        yield put(reload());
        closeDialog();
      } else {
        if (typeof data.message === 'object') {
          yield put(actions[FAILURE](newFailure(data.message)));
        } else {
          yield put(toast.failure(data.message));
        }
      }
    } catch (e) {
      yield put(actions[FAILURE](newFailure(e)));
      yield put(toast.failure(e.message));
    }
  }

  function* sagas() {
    yield takeLatest(constants[REQUEST], execute);
  }

  const selector = createSelector(
    (s) => state(s).loading,
    (s) => state(s).failure,
    (loading, failure) => ({
      errors: failure,
      loading,
      request: actions[REQUEST],
    })
  );
  return new Module({ [store]: reducer }, sagas, selector);
};

const taskSchema = ({ email, username, text, status }) => ({
  username: username.value,
  email: email.value,
  text: text.value,
  status: status.value,
});

export const create = newTaskPostModule({
  store: 'create',
  state: (s) => s.create,
  endpoint: function* ({ item }) {
    const resp = yield call(
      api.tasks.createTask,
      getFormData(taskSchema(item))
    );
    return resp;
  },
});

export const edit = newTaskPostModule({
  store: 'edit',
  state: (s) => s.edit,
  endpoint: function* ({ id, item, logout }) {
    const resp = yield call(
      api.tasks.editTask,
      id,
      getFormData({
        ...taskSchema(item),
        token: storage.getToken(),
      })
    );
    const data = yield resp.data;
    if (data.status === ERROR_RESPONSE_STATUS && data.message?.token) {
      yield put(toast.failure(data.message.token));
      yield put(logout());
    }
    return resp;
  },
});
