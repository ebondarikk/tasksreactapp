import { createSelector } from 'reselect';
import { put, takeLatest, call } from 'redux-saga/effects';
import { OK_RESPONSE_STATUS } from 'consts';
import api from 'api';
import {
  REQUEST,
  SUCCESS,
  FAILURE,
  newFailure,
  newRequestConstants,
  newRequestActions,
  Module,
  newPostReducer,
  getFormData,
  CLEANUP,
} from 'redux/utils';
import toast from 'components/Toast';
import storage from 'storage';

const store = 'app/tasks/login';
const constants = newRequestConstants(store);
const actions = newRequestActions(constants);
const reducer = newPostReducer(constants, true);

const LOGOUT = `${store}/logout`;

const logout_action = () => ({ type: LOGOUT });

const loginSchema = ({ username, password }) => ({
  username: username.value,
  password: password.value,
});

function* login({ _, data: { credentials, closeDialog, confirmation } }) {
  try {
    const resp = yield call(
      api.tasks.login,
      getFormData(loginSchema(credentials))
    );
    const data = yield resp.data;
    if (data.status === OK_RESPONSE_STATUS) {
      yield put(toast.success(confirmation));
      yield storage.setToken(data.message.token);
      yield put(actions[SUCCESS]());
      yield closeDialog();
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

function* logout() {
  yield put(actions[CLEANUP]());
  yield storage.removeToken();
}

function* sagas() {
  yield takeLatest(constants[REQUEST], login);
  yield takeLatest(LOGOUT, logout);
}

const selector = createSelector(
  (s) => s.login.loading,
  (s) => s.login.failure,
  (s) => s.login.success,
  (loading, failure, success) => ({
    errors: failure,
    loading,
    success,
    request: actions[REQUEST],
    logout: logout_action,
  })
);

export default new Module({ login: reducer }, sagas, selector);
