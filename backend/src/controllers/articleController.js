const Article = require('../models/Article');
const Tag = require('../models/Tag');

exports.createArticle = async (req, res) => {
    try {
        const { title, content, author_id, tags } = req.body; // Tags is an array of tag IDs

        // Create the new article
        const newArticle = await Article.create({ title, content, author_id });

        // Associate tags with the article
        if (tags && tags.length > 0) {
            await newArticle.setTags(tags);
        }

        res.status(201).json({ message: 'Article created successfully', article: newArticle });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getArticlesByTag = async (req, res) => {
    try {
        const { tagName } = req.params; 

        const articles = await Article.findAll({
            include: [
                {
                    model: Tag,
                    where: { name: tagName }, 
                    through: { attributes: [] },
                },
            ],
        });

        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
