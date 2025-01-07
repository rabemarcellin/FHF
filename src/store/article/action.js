import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { getArticlesService, newArticleService } from "../../services/article";

const actions = {
  CREATE_NEW_ARTICLE: "article/new",
  GET_ALL_ARTICLES: "article/all",
};

export const createNewArticleAction = createAsyncThunk(
  actions.CREATE_NEW_ARTICLE,
  async (article, ThunkApi) => {
    try {
      const newArticle = await newArticleService(
        article.title,
        article.desc,
        article.pictures,
        article.eventDate,
        article.userId
      );
      return ThunkApi.fulfillWithValue(newArticle);
    } catch (error) {
      console.log(error.message);
      return;
    }
  }
);

export const getArticlesAction = createAsyncThunk(
  actions.GET_ALL_ARTICLES,
  async (_, ThunkApi) => {
    try {
      const articles = await getArticlesService();
      return ThunkApi.fulfillWithValue(articles);
    } catch (error) {
      console.log(error.message);
      return ThunkApi.rejectWithValue([]);
    }
  }
);
