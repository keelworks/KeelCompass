const request = require("supertest");
const app = require("../../app");
const db = require("../../models");
const { generateToken } = require("../../utils/jwtUtils");

describe("question reactions (via /api/question-actions)", () => {
  let author, actor, question, actorToken, authorToken;

  beforeAll(async () => {
    const stamp = Date.now();
    author = await db.User.create({ email: `reaction-author-${stamp}@test.local`, display_name: "Author" });
    actor = await db.User.create({ email: `reaction-actor-${stamp}@test.local`, display_name: "Actor" });
    question = await db.Question.create({
      user_id: author.id,
      title: "Test question for reactions",
      description: "Does this reaction system work?",
    });
    authorToken = generateToken({ id: author.id });
    actorToken = generateToken({ id: actor.id });
  });

  afterAll(async () => {
    await db.User.destroy({ where: { id: [author.id, actor.id] } });
    await db.sequelize.close();
  });

  afterEach(async () => {
    await db.UserQuestionAction.destroy({ where: { question_id: question.id } });
    await db.Notification.destroy({ where: { question_id: question.id } });
    await db.User.update({ reputation_points: 0 }, { where: { id: [author.id, actor.id] } });
  });

  const react = (token, actionType) =>
    request(app)
      .post("/api/question-actions/action")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question.id, actionType });

  const unreact = (token, actionType) =>
    request(app)
      .delete("/api/question-actions/action")
      .set("Authorization", `Bearer ${token}`)
      .send({ questionId: question.id, actionType });

  it("grants the author +1 reputation and exactly one notification on a fresh reaction", async () => {
    const res = await react(actorToken, "celebrate");
    expect(res.status).toBe(201);

    const refreshedAuthor = await db.User.findByPk(author.id);
    expect(refreshedAuthor.reputation_points).toBe(1);

    const notifications = await db.Notification.findAll({
      where: { source_type: "question_reaction", source_id: question.id },
    });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toContain("🎉");
    expect(notifications[0].message).toContain("Celebrate");
    expect(notifications[0].type).toBe("liked");
  });

  it("switching reaction types nets zero reputation change and leaves exactly one notification", async () => {
    await react(actorToken, "celebrate");
    const res = await react(actorToken, "love");
    expect(res.status).toBe(201);

    const refreshedAuthor = await db.User.findByPk(author.id);
    expect(refreshedAuthor.reputation_points).toBe(1);

    const notifications = await db.Notification.findAll({
      where: { source_type: "question_reaction", source_id: question.id },
    });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toContain("❤️");
    expect(notifications[0].message).toContain("Love");
  });

  it("rejects re-selecting the already-active reaction with 409", async () => {
    await react(actorToken, "like");
    const res = await react(actorToken, "like");
    expect(res.status).toBe(409);
  });

  it("removing a reaction reverses reputation and deletes its notification", async () => {
    await react(actorToken, "support");
    const res = await unreact(actorToken, "support");
    expect(res.status).toBe(200);

    const refreshedAuthor = await db.User.findByPk(author.id);
    expect(refreshedAuthor.reputation_points).toBe(0);

    const notifications = await db.Notification.findAll({
      where: { source_type: "question_reaction", source_id: question.id },
    });
    expect(notifications).toHaveLength(0);
  });

  it("keeps report fully independent of reactions in both directions", async () => {
    await react(actorToken, "like");
    const reportRes = await react(actorToken, "report");
    expect(reportRes.status).toBe(201);

    // removing the reaction must not touch the report notification
    await unreact(actorToken, "like");
    const reportNotifications = await db.Notification.findAll({
      where: { source_type: "question_report", source_id: question.id },
    });
    expect(reportNotifications).toHaveLength(1);

    const reactionNotifications = await db.Notification.findAll({
      where: { source_type: "question_reaction", source_id: question.id },
    });
    expect(reactionNotifications).toHaveLength(0);
  });

  it("grants no reputation or notification for reacting to your own question", async () => {
    const res = await react(authorToken, "insightful");
    expect(res.status).toBe(201);

    const refreshedAuthor = await db.User.findByPk(author.id);
    expect(refreshedAuthor.reputation_points).toBe(0);

    const notifications = await db.Notification.findAll({
      where: { source_type: "question_reaction", source_id: question.id },
    });
    expect(notifications).toHaveLength(0);
  });

  it("rejects an unknown actionType with 400, not 500", async () => {
    const res = await react(actorToken, "laugh");
    expect(res.status).toBe(400);
  });
});
