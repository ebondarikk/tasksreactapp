const url = (path) => `/${path}`;

export const tasks = (api) => ({
  listTasks: () => api.get('/'),
});
