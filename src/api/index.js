import axios from 'axios';
import qs from 'query-string';
import { pickBy } from 'lodash-es';
import { tasks } from './tasks';
// import { interseptToken } from './interceptors';

const BASE_URL = 'https://uxcandy.com/~shapoval/test-task-backend/v2/';

const axiosCfg = {
  baseURL: BASE_URL,
  responseType: 'json',
  paramsSerializer: (params) =>
    qs.stringify(
      pickBy(params, (x) => x !== null && x !== undefined && x !== '')
    ),
};

export const client = axios.create(axiosCfg);

export default {
  tasks: tasks(client),
};
