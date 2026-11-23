const request = require("supertest");
const app = require("../../app");
const db = require("../../models");
const { generateToken } = require("../../utils/jwtUtils");

describe("comment reactions (via /api/comment-actions)", () => {
  let author, actor, question, comment, actorToken, authorToken;

  beforeAll(async () => {
    const stamp = Date.now();
    author = await db.User.create({ email: `comment-reaction-author-${stamp}@test.local`, display_name: "Author" });
    actor = await db.User.create({ email: `comment-reaction-actor-${stamp}@test.local`, display_name: "Actor" });
    question = await db.Question.create({
      user_id: author.id,
      title: "Test question for comment reactions",
      description: "Parent question for comment reaction tests.",
    });
    comment = await db.Comment.create({
      user_id: author.id,
      question_id: question.id,
      content: "Test comment for reactions",
    });
    authorToken = generateToken({ id: author.id });
    actorToken = generateToken({ id: actor.id });
  });

  afterAll(async () => {
    await db.User.destroy({ where: { id: [author.id, actor.id] } });
    await db.sequelize.close();
  });

  afterEach(async () => {
    await db.UserCommentAction.destroy({ where: { comment_id: comment.id } });
    await db.Notification.destroy({ where: { comment_id: comment.id } });
    await db.User.update({ reputation_points: 0 }, { where: { id: [author.id, actor.id] } });
  });

  const react = (token, actionType) =>
    request(app)
      .post("/api/comment-actions/action")
      .set("Authorization", `Bearer ${token}`)
      .send({ commentId: comment.id, actionType });

  const unreact = (token, actionType) =>
    request(app)
      .delete("/api/comment-actions/action")
      .set("Authorization", `Bearer ${token}`)
      .send({ commentId: comment.id, actionType });

  it("grants the comment author +1 reputation and exactly one notification on a fresh reaction", async () => {
    const res = await react(actorToken, "curious");
    expect(res.status).toBe(201);

    const refreshedAuthor = await db.User.findByPk(author.id);
    expect(refreshedAuthor.reputation_points).toBe(1);

    const notifications = await db.Notification.findAll({
      where: { source_type: "comment_reaction", source_id: comment.id },
    });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toContain("🤔");
    expect(notifications[0].message).toContain("Curious");
  });

  it("switching reaction types nets zero reputation change and leaves exactly one notification", async () => {
    await react(actorToken, "curious");
    const res = await react(actorToken, "support");
    expect(res.status).toBe(201);

    const refreshedAuthor = await db.User.findByPk(author.id);
    expect(refreshedAuthor.reputation_points).toBe(1);

    const notifications = await db.Notification.findAll({
      where: { source_type: "comment_reaction", source_id: comment.id },
    });
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toContain("🤝");
  });

  it("rejects re-selecting the already-active reaction with 409", async () => {
    await react(actorToken, "like");
    const res = await react(actorToken, "like");
    expect(res.status).toBe(409);
  });

  it("removing a reaction reverses reputation and deletes its notification", async () => {
    await react(actorToken, "love");
    const res = await unreact(actorToken, "love");
    expect(res.status).toBe(200);

    const refreshedAuthor = await db.User.findByPk(author.id);
    expect(refreshedAuthor.reputation_points).toBe(0);

    const notifications = await db.Notification.findAll({
      where: { source_type: "comment_reaction", source_id: comment.id },
    });
    expect(notifications).toHaveLength(0);
  });

  it("keeps report fully independent of reactions in both directions", async () => {
    await react(actorToken, "like");
    const reportRes = await react(actorToken, "report");
    expect(reportRes.status).toBe(201);

    await unreact(actorToken, "like");
    const reportNotifications = await db.Notification.findAll({
      where: { source_type: "comment_report", source_id: comment.id },
    });
    expect(reportNotifications).toHaveLength(1);

    const reactionNotifications = await db.Notification.findAll({
      where: { source_type: "comment_reaction", source_id: comment.id },
    });
    expect(reactionNotifications).toHaveLength(0);
  });

  it("grants no reputation or notification for reacting to your own comment", async () => {
    const res = await react(authorToken, "insightful");
    expect(res.status).toBe(201);

    const refreshedAuthor = await db.User.findByPk(author.id);
    expect(refreshedAuthor.reputation_points).toBe(0);

    const notifications = await db.Notification.findAll({
      where: { source_type: "comment_reaction", source_id: comment.id },
    });
    expect(notifications).toHaveLength(0);
  });

  it("rejects an unknown actionType with 400, not 500", async () => {
    const res = await react(actorToken, "laugh");
    expect(res.status).toBe(400);
  });
});
