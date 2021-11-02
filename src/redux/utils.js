import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import storage from 'storage';

const devtools = window.__REDUX_DEVTOOLS_EXTENSION__;

export const newStore = (reducers, sagas, state = {}) => {
  const history = createBrowserHistory();
  const reducer = combineReducers(reducers);
  const sagamw = createSagaMiddleware();

  const store = createStore(
    reducer,
    state,
    compose(
      applyMiddleware(sagamw, routerMiddleware(history)),
      ...((devtools && [devtools()]) || [])
    )
  );

  sagamw.run(function* () {
    yield all(sagas.map(fork));
  });

  return [store, history];
};

export class Failure {
  constructor(code, detail) {
    this.code = code;
    this.detail = detail;
  }
}

export const EXCEPTION_CODE = 1;

export const newFailure = (e, schema = (x) => x) => {
  if (e?.response) {
    return new Failure(e.response.status, schema(e.response.data));
  }
  return new Failure(EXCEPTION_CODE, schema(e));
};

export const REQUEST = 0;
export const SUCCESS = 1;
export const FAILURE = 2;
export const CLEANUP = 3;

export const defineConstants = (namespace, ...constants) =>
  constants.map((c) => `${namespace}/${c}`);

export const newRequestConstants = (namespace) => [
  `${namespace}/request`,
  `${namespace}/success`,
  `${namespace}/failure`,
  `${namespace}/cleanup`,
];

export const newAction = (type) => (data) => ({ type: type, data: data });

export const newRequestActions = (constants) => [
  newAction(constants[REQUEST]),
  newAction(constants[SUCCESS]),
  newAction(constants[FAILURE]),
  () => ({ type: constants[CLEANUP] }),
];

export const newReducer = (steps, initial = {}) => {
  return (state = initial, action) => {
    return (steps[action.type] || ((_s, _a) => state))(state, action);
  };
};

export const newListReducer = (constants) =>
  newReducer(
    {
      [constants[REQUEST]]: (state, _) => ({
        ...state,
        loading: true,
      }),
      [constants[SUCCESS]]: (state, action) => ({
        ...state,
        loading: false,
        failure: null,
        results: action.data.items,
        count: parseInt(action.data.count),
      }),
      [constants[FAILURE]]: (_, action) => ({
        count: 0,
        results: [],
        loading: false,
        failure: action.data,
      }),
      [constants[CLEANUP]]: (_) => ({
        count: 0,
        results: [],
        loading: false,
        failure: null,
      }),
    },
    {
      count: 0,
      results: [],
      loading: false,
      failure: null,
    }
  );

export const newPostReducer = (constants, forLogin = false) =>
  newReducer(
    {
      [constants[REQUEST]]: (state, _) => ({
        ...state,
        loading: true,
      }),
      [constants[SUCCESS]]: (state, _) => ({
        ...state,
        loading: false,
        failure: null,
        success: true,
      }),
      [constants[FAILURE]]: (_, action) => ({
        loading: false,
        failure: action.data?.detail,
        success: false,
      }),
      [constants[CLEANUP]]: (_) => ({
        loading: false,
        failure: null,
        success: false,
      }),
    },
    {
      loading: false,
      failure: null,
      // TODO: fix it
      success: forLogin ? storage.getToken() : false,
    }
  );

export class Module {
  constructor(reducers, sagas, selectors) {
    this.reducers = reducers;
    this.sagas = sagas;
    this.selectors = selectors;
  }
}

export const getFormData = (object) =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
  }, new FormData());
