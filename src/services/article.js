import api from "./api";

export const getArticlesService = async () => {
  const response = await api.get("/article/all");
  return response.data;
};

export const getOneArticleService = async (articleId) => {
  const response = await api.get(`/article/${articleId}`);
  return response.data;
};

export const newArticleService = async (title, desc, pictures, eventDate) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("desc", desc);
  formData.append("eventDate", eventDate);
  pictures.forEach((picture) => formData.append("picture", picture));

  const response = await api.post("/article/create", formData);

  if (response.status === 201) {
    return response.data;
  } else {
    throw new Error("Add Article to server error");
  }
};
