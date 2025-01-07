const express = require("express");
const { uploadArticlePicture } = require("../vendors/multer");
const { bearerTokenMiddleware } = require("../middleware/auth");
const {
  createArticle,
  getArticles,
  getOneArticle,
} = require("../models/Article");

const articleRouter = express.Router();

articleRouter.get("/all", bearerTokenMiddleware, async (req, res) => {
  const allArticles = await getArticles();
  res.json(allArticles);
});

articleRouter.get("/:articleId", bearerTokenMiddleware, async (req, res) => {
  console.log(
    `/article/${req.params.articleId}`,
    new Date().toLocaleString("fr-Fr")
  );
  const { articleId } = req.params;
  const article = await getOneArticle(articleId);
  res.json(article);
});

articleRouter.post(
  "/create",
  bearerTokenMiddleware,
  uploadArticlePicture.array("picture"),
  async (req, res) => {
    console.log("/article/create", new Date().toLocaleString("fr-Fr"));
    const articleTitle = req.body.title;
    const articleDesc = req.body.desc;
    const eventDate = req.body.eventDate;
    const pictures = req.files.map((each) => each.path);
    const newArticle = await createArticle(
      articleTitle,
      articleDesc,
      pictures,
      eventDate
    );
    if (newArticle) {
      res.status(201).json(newArticle);
    } else {
      res.sendStatus(500);
    }
  }
);

module.exports = articleRouter;
