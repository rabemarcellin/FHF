export const selectAllArticles = (state) => state.article.items;

export const selectArticlesByDate = (state, date) =>
  state.article.items.filter((article) => {
    if (article.eventDate) {
      const articleDate = new Date(article.eventDate);
      return articleDate.getTime() === date.getTime();
    }
    return false;
  });
