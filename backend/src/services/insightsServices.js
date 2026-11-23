const logEverything = require("../utils/logEverything");
const { HttpError } = require("../utils/httpError");

const db = require("../models");
const Question = db.Question;
const Category = db.Category;
const QuestionTag = db.QuestionTag;
const Comment = db.Comment;

const STALE_AFTER_DAYS = 3;

const getInsights = async () => {
  try {
    const questions = await Question.findAll({
      where: { deleted_at: null },
      attributes: ["id", "title", "created_at"],
      include: [
        { model: Category, attributes: ["id", "name"], through: { attributes: [] } },
        { model: Comment, as: "comments", attributes: ["id", "created_at"] },
      ],
    });

    const categoryCounts = new Map();
    for (const q of questions) {
      for (const cat of q.Categories || []) {
        categoryCounts.set(cat.name, (categoryCounts.get(cat.name) || 0) + 1);
      }
    }
    const topCategories = [...categoryCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const tagRows = await QuestionTag.findAll({ attributes: ["tag"] });
    const tagCounts = new Map();
    for (const row of tagRows) {
      tagCounts.set(row.tag, (tagCounts.get(row.tag) || 0) + 1);
    }
    const topTags = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    const unansweredCount = questions.filter((q) => (q.comments || []).length === 0).length;

    const responseTimesMs = questions
      .filter((q) => (q.comments || []).length > 0)
      .map((q) => {
        const firstComment = [...q.comments].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )[0];
        return new Date(firstComment.created_at) - new Date(q.created_at);
      });
    const avgResponseTimeHours =
      responseTimesMs.length > 0
        ? responseTimesMs.reduce((sum, ms) => sum + ms, 0) / responseTimesMs.length / (1000 * 60 * 60)
        : null;

    // unanswered posts aging past the threshold, oldest first - surfaces the
    // backlog that actually needs a nudge, not just a bare count of it
    const now = Date.now();
    const staleThresholdMs = STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;
    const staleQuestions = questions
      .filter((q) => (q.comments || []).length === 0 && now - new Date(q.created_at).getTime() > staleThresholdMs)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(0, 15)
      .map((q) => ({
        id: q.id,
        title: q.title,
        createdAt: q.created_at,
        ageDays: Math.floor((now - new Date(q.created_at).getTime()) / (24 * 60 * 60 * 1000)),
      }));

    return {
      totalQuestions: questions.length,
      unansweredCount,
      avgResponseTimeHours: avgResponseTimeHours !== null ? Math.round(avgResponseTimeHours * 10) / 10 : null,
      topCategories,
      topTags,
      staleQuestions,
    };
  } catch (error) {
    logEverything(error, "insightsServices");
    if (error instanceof HttpError) throw error;
    throw new HttpError(500, "Error retrieving insights");
  }
};

module.exports = { getInsights };
