const db = require("../../models");
const questionService = require("../questionServices");

describe("tag-based question visibility - admin bypass", () => {
  let author, question;

  beforeAll(async () => {
    const stamp = Date.now();
    author = await db.User.create({ email: `visibility-author-${stamp}@test.local`, display_name: "Author" });
    question = await db.Question.create({
      user_id: author.id,
      title: "Visibility test question",
      description: "Only the sd group should normally see this.",
    });
    await db.QuestionTag.create({ question_id: question.id, tag: "sd" });
  });

  afterAll(async () => {
    await db.QuestionTag.destroy({ where: { question_id: question.id } });
    await db.Question.destroy({ where: { id: question.id } });
    await db.User.destroy({ where: { id: author.id } });
    await db.sequelize.close();
  });

  it("hides a tagged question from a non-matching, non-admin viewer", async () => {
    const canView = await questionService.canUserViewQuestion(question.id, null, "prod mgr");
    expect(canView).toBe(false);

    await expect(questionService.getQuestion(999999, question.id, "prod mgr")).rejects.toMatchObject({
      statusCode: 404,
    });

    const recent = await questionService.getRecentQuestions(999999, 50, 0, "prod mgr");
    expect(recent.questions.some((q) => q.id === question.id)).toBe(false);
  });

  it("still shows a tagged question to a matching viewer", async () => {
    const canView = await questionService.canUserViewQuestion(question.id, null, "sd");
    expect(canView).toBe(true);
  });

  it("lets an admin see a tagged question regardless of their own tag", async () => {
    const canView = await questionService.canUserViewQuestion(question.id, null, "prod mgr", true);
    expect(canView).toBe(true);

    const fetched = await questionService.getQuestion(999999, question.id, "prod mgr", true);
    expect(fetched.id).toBe(question.id);

    const recent = await questionService.getRecentQuestions(999999, 50, 0, "prod mgr", false, true);
    expect(recent.questions.some((q) => q.id === question.id)).toBe(true);
  });
});
