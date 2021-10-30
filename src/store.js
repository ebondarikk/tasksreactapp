import { newStore } from './redux/utils';
import { default as common } from './redux';

const reducers = { ...common.reducers };

const sagas = [...common.sagas];

export const [store, history] = newStore(reducers, sagas);
