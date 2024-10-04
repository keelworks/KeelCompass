const Tag = require('../models/Tag');

exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const tag = await Tag.create({ name });
        res.status(201).json(tag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

