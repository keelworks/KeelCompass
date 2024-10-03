const articleService = require("../services/articleService");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

module.exports = {
  createArticle: async (req, res) => {
    try {
      console.log(req.body);
      const { authorID, title, content } = req.body;

      const articleID = await articleService.createArticle(
        authorID,
        title,
        content
      );
      console.log(articleID);

      res.json({ message: "created", articleID: articleID });
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res
          .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Server Error" });
      }
    }
  },
};
