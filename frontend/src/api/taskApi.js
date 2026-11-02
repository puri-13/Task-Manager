import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api",
  headers: { "Content-Type": "application/json" }
});

export const taskApi = {
  getAll: async () => (await api.get("/tasks")).data,
  getById: async (id) => (await api.get(`/tasks/${id}`)).data,
  create: async (task) => (await api.post("/tasks", task)).data,
  update: async (id, task) => (await api.put(`/tasks/${id}`, task)).data,
  remove: async (id) => api.delete(`/tasks/${id}`),
  updateStatus: async (id, status) => (await api.patch(`/tasks/${id}/status`, { status })).data
};

export function getErrorMessage(error) {
  if (error.response?.data?.message || error.response?.data?.error) {
    return error.response.data.message || error.response.data.error;
  }
  if (!error.response) {
    return `Cannot reach the Taskflow API at ${api.defaults.baseURL}. Start the backend and check its MySQL connection settings.`;
  }
  return error.message || "Something went wrong.";
}
