export const tasks = (api) => ({
  listTasks: (params) => api.get('/', { params }),
  createTask: (formData) => api.post(`/create`, formData),
  editTask: (id, formData) => api.post(`/edit/${id}`, formData),
  login: (formData) => api.post('/login', formData),
});
