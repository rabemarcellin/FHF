const express = require("express");
const { uploadArticlePicture } = require("../vendors/multer");
const { bearerTokenMiddleware } = require("../middleware/auth");
const {
  createArticle,
  getArticles,
  getOneArticle,
  updateArticle,
  getArticlesByDate,
} = require("../models/Article");

const articleRouter = express.Router();

articleRouter.get("/all", bearerTokenMiddleware, async (req, res) => {
  const allArticles = await getArticles();
  res.json(allArticles);
});

articleRouter.get("/:articleId", bearerTokenMiddleware, async (req, res) => {
  console.log(
    "GET",
    `/article/${req.params.articleId}`,
    new Date().toLocaleString("fr-Fr")
  );
  const { articleId } = req.params;
  const article = await getOneArticle(articleId);
  res.json(article);
});

articleRouter.get("/date/:date", bearerTokenMiddleware, async (req, res) => {
  console.log(
    "GET",
    `/article/date/${req.params.date}`,
    new Date().toLocaleString("fr-Fr")
  );

  const dateStringFormat = req.params.date;
  const date = new Date(dateStringFormat);
  const articlesByDate = await getArticlesByDate(date);
  res.json(articlesByDate);
});

articleRouter.post(
  "/create",
  bearerTokenMiddleware,
  uploadArticlePicture.array("picture"),
  async (req, res) => {
    console.log("POST", "/article/create", new Date().toLocaleString("fr-Fr"));
    const articleTitle = req.body.title;
    const articleDesc = req.body.desc;
    const eventDate = req.body.eventDate;
    const userId = req.body.userId;
    const pictures = req.files.map((each) => each.path);
    const newArticle = await createArticle(
      articleTitle,
      articleDesc,
      pictures,
      eventDate,
      userId
    );
    if (newArticle) {
      res.status(201).json(newArticle);
    } else {
      res.sendStatus(500);
    }
  }
);

articleRouter.post(
  "/update/:articleId",
  bearerTokenMiddleware,
  async (req, res) => {
    console.log(
      "POST",
      `/article/update/${req.params.articleId}`,
      new Date().toLocaleString("fr-Fr")
    );

    const articleId = req.params.articleId;
    const { title, desc, eventDate } = req.body;

    const articleUpdated = await updateArticle(
      articleId,
      title,
      desc,
      eventDate
    );
    if (articleUpdated) {
      res.json(articleUpdated);
    } else {
      res.sendStatus(500);
    }
  }
);

module.exports = articleRouter;
