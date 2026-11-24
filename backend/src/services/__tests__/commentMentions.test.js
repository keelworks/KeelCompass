const request = require("supertest");
const app = require("../../app");
const db = require("../../models");
const { generateToken } = require("../../utils/jwtUtils");

describe("comment creation - mentionedGroupTags", () => {
  let author, explicitMentionUser, groupMemberOne, groupMemberTwo, outsider, question, authorToken;

  beforeAll(async () => {
    const stamp = Date.now();
    author = await db.User.create({ email: `comment-mention-author-${stamp}@test.local`, display_name: "Author" });
    explicitMentionUser = await db.User.create({
      email: `comment-mention-explicit-${stamp}@test.local`,
      display_name: "Explicit Mention",
    });
    groupMemberOne = await db.User.create({
      email: `comment-mention-group1-${stamp}@test.local`,
      display_name: "Group Member One",
      raw_role_tag: "SD",
    });
    groupMemberTwo = await db.User.create({
      email: `comment-mention-group2-${stamp}@test.local`,
      display_name: "Group Member Two",
      manual_role_tag: "SD",
    });
    outsider = await db.User.create({
      email: `comment-mention-outsider-${stamp}@test.local`,
      display_name: "Outsider",
      raw_role_tag: "QA",
    });
    question = await db.Question.create({
      user_id: author.id,
      title: "Comment mention test question",
      description: "Testing group mentions on comments.",
    });
    authorToken = generateToken({ id: author.id });
  });

  afterAll(async () => {
    await db.User.destroy({
      where: { id: [author.id, explicitMentionUser.id, groupMemberOne.id, groupMemberTwo.id, outsider.id] },
    });
    await db.Question.destroy({ where: { id: question.id } });
    await db.sequelize.close();
  });

  const relevantUserIds = () => [
    author.id,
    explicitMentionUser.id,
    groupMemberOne.id,
    groupMemberTwo.id,
    outsider.id,
  ];

  afterEach(async () => {
    await db.Comment.destroy({ where: { question_id: question.id } });
    await db.Notification.destroy({ where: { type: "mention", user_id: relevantUserIds() } });
  });

  it("notifies an explicitly mentioned user and every member of a mentioned group, without double-notifying overlap", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        questionId: question.id,
        content: "cc @SD and also @explicit",
        mentionedUserIds: [explicitMentionUser.id, groupMemberOne.id],
        mentionedGroupTags: ["SD"],
      });

    expect(res.status).toBe(201);

    const notifications = await db.Notification.findAll({
      where: { type: "mention", user_id: relevantUserIds() },
    });
    const recipientIds = notifications.map((n) => n.user_id).sort();

    expect(recipientIds).toEqual([explicitMentionUser.id, groupMemberOne.id, groupMemberTwo.id].sort());
    expect(recipientIds).not.toContain(outsider.id);
    expect(recipientIds).not.toContain(author.id);
    // groupMemberOne was named both explicitly and via the group tag - must
    // only receive one notification, not two
    expect(recipientIds.filter((id) => id === groupMemberOne.id)).toHaveLength(1);
  });

  it("ignores an unknown/empty group tag without erroring", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        questionId: question.id,
        content: "no real group here",
        mentionedGroupTags: ["", "nonexistent-tag-xyz"],
      });

    expect(res.status).toBe(201);
    const notifications = await db.Notification.findAll({
      where: { type: "mention", user_id: relevantUserIds() },
    });
    expect(notifications).toHaveLength(0);
  });
});
