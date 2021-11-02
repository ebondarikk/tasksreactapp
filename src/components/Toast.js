import { toast } from 'react-toastify';
import { takeLatest } from 'redux-saga/effects';

const SUCCESS = 'app/toast/success';
const FAILURE = 'app/toast/failure';

const success = (msg) => ({ type: SUCCESS, msg });
const failure = (msg) => ({ type: FAILURE, msg });

function* sagas() {
  yield takeLatest(SUCCESS, function* ({ _, msg }) {
    yield toast.success(msg);
  });
  yield takeLatest(FAILURE, function* ({ _, msg }) {
    yield toast.error(msg);
  });
}

export default {
  success,
  failure,
  sagas,
};
