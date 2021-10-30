import tasks from './tasks';

export default {
  reducers: { ...tasks.reducers },
  sagas: [tasks.sagas],
};
