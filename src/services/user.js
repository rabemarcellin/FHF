import api from "./api";

export const getUserByIdService = async (id) => {
  const response = await api.get("/user/" + id);
  return response.data;
};
