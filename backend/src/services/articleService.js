const User = require("../models/user");
const Article = require("../models/article");
const { HttpError, HttpStatusCodes } = require("../utils/httpError");

const createArticle = async (userID, title, content) => {
  // Check if the user exists
  const user = await User.findByPk(userID);
  if (!user) {
    console.log("failed to find user: ", userID);
    throw new HttpError(
      HttpStatusCodes.BAD_REQUEST,
      `user with id = ${userID} doesn't exist`
    );
  }
  // console.log(user);
  console.log(user.id);
  console.log(user.username);

  // Create the new article
  try {
    const article = await Article.create({
      title: title,
      content: content,
      author_id: userID,
    });

    console.log("Article created:", article);
    return article.id;
  } catch (error) {
    throw new HttpError(
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      `create article failed, err=${error}`
    );
  }
};

module.exports = {
  createArticle,
};
