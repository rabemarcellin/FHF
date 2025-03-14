import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getArticlesService,
  getArtilesByDateService,
  newArticleService,
  updateArticleService,
} from "../../services/article";

const actions = {
  CREATE_NEW_ARTICLE: "article/new",
  GET_ALL_ARTICLES: "article/all",
  UPDATE_ARTICLE: "article/update",
  GET_ARTICLE_BY_DAY: "article/one-day",
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

export const getArticlesByDateAction = createAsyncThunk(
  actions.GET_ARTICLE_BY_DAY,
  async (dateStringFormat, ThunkApi) => {
    try {
      const articlesByDate = await getArtilesByDateService(
        dateStringFormat.year +
          "-" +
          dateStringFormat.month.toString().padStart(2, "0") +
          "-" +
          dateStringFormat.date.toString().padStart(2, "0")
      );
      return ThunkApi.fulfillWithValue(articlesByDate);
    } catch (error) {
      console.log(error.message);
      return [];
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

export const updateArticleAction = createAsyncThunk(
  actions.UPDATE_ARTICLE,
  async (article, ThunkApi) => {
    try {
      const { articleId, title, desc, eventDate } = article;
      const articleUpdated = await updateArticleService(
        articleId,
        title,
        desc,
        eventDate
      );
      if (articleUpdated) return ThunkApi.fulfillWithValue(articleUpdated);
      throw new Error("error on update article");
    } catch (error) {
      console.error(error.message);
      return ThunkApi.rejectWithValue(null);
    }
  }
);
