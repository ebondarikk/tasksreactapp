import { createSelector } from 'reselect';
import { put, takeLatest, call } from 'redux-saga/effects';
import api from 'api';
import {
  REQUEST,
  SUCCESS,
  FAILURE,
  newFailure,
  newRequestConstants,
  newRequestActions,
  newListReducer,
  Module,
} from 'redux/utils';

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

function* list({ _, data = {} }) {
  try {
    const resp = yield call(api.tasks.listTasks, data);
    const message = yield resp.data.message;
    yield put(
      actions[SUCCESS]({
        items: message.tasks.map(schema),
        count: message.total_task_count,
      })
    );
  } catch (e) {
    yield put(actions[FAILURE](newFailure(e)));
  }
}

function* sagas() {
  yield takeLatest(constants[REQUEST], list);
}

const selector = createSelector(
  (s) => s.tasks.loading,
  (s) => s.tasks.failure,
  (s) => s.tasks.results,
  (s) => s.tasks.count,
  (loading, failure, results, count) => ({
    results,
    loading,
    failure,
    count,
    request: actions[REQUEST],
  })
);

export default new Module({ tasks: reducer }, sagas, selector);
