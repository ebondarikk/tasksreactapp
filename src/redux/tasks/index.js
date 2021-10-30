import { isEmpty } from 'lodash-es';
import { createSelector } from 'reselect';
import { put, takeLatest, call } from 'redux-saga/effects';
import { DEFAULT_DEVELOPER } from '../../constants';
import api from '../../api';
import {
  REQUEST,
  SUCCESS,
  FAILURE,
  newFailure,
  newRequestConstants,
  newRequestActions,
  newListReducer,
  Module,
} from '../utils';

const constants = newRequestConstants('app/tasks/list');
const actions = newRequestActions(constants);
const reducer = newListReducer(constants);

const schema = (x) => ({
  id: x.id,
  username: x.username,
  email: x.email,
  text: x.text,
  status: x.status,
});

function* list({ _, data }) {
  try {
    const resp = yield call(api.contents.listTasks, {
      developer: DEFAULT_DEVELOPER,
    });
    const tasks = yield resp.message.tasks.map(schema);
    yield put(actions[SUCCESS]({ items: tasks }));
  } catch (e) {
    yield put(actions[FAILURE](newFailure(e)));
  }
}

function* sagas() {
  yield takeLatest(constants[REQUEST], list);
}

const selector = createSelector((tasks, loading, failure) => ({
  results: tasks,
  request: actions[REQUEST],
  loading: loading,
  failure: failure,
}));

export default new Module({ tasks: reducer }, sagas, selector);
