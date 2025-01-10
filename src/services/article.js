import api from "./api";

export const getArticlesService = async () => {
  const response = await api.get("/article/all");
  return response.data;
};

export const getOneArticleService = async (articleId) => {
  const response = await api.get(`/article/${articleId}`);
  return response.data;
};

export const getArtilesByDateService = async (dateStringFormat) => {
  const response = await api.get("/article/date/" + dateStringFormat);
  return !Array.isArray(response.data) ? [] : response.data;
};

export const newArticleService = async (
  title,
  desc,
  pictures,
  eventDate,
  userId
) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("desc", desc);
  formData.append("eventDate", eventDate);
  formData.append("userId", userId);
  pictures.forEach((picture) => formData.append("picture", picture));

  const response = await api.post("/article/create", formData);

  if (response.status === 201) return response.data;
  return;
};

export const updateArticleService = async (
  articleId,
  title,
  desc,
  eventDate
) => {
  const response = await api.post("/article/update/" + articleId, {
    title,
    desc,
    eventDate,
  });

  if (response.status === 200) return response.data;
  return;
};
