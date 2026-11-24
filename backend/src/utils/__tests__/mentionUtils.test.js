const db = require("../../models");
const { resolveUsersByRoleTag } = require("../mentionUtils");

describe("resolveUsersByRoleTag", () => {
  let rawOnlyUser, manualOverrideUser, punctuatedTagUser, noMatchUser;

  beforeAll(async () => {
    const stamp = Date.now();
    rawOnlyUser = await db.User.create({
      email: `mention-raw-${stamp}@test.local`,
      display_name: "Raw Tag User",
      raw_role_tag: "SD",
    });
    manualOverrideUser = await db.User.create({
      email: `mention-manual-${stamp}@test.local`,
      display_name: "Manual Tag User",
      raw_role_tag: "Prod Mgr",
      manual_role_tag: "SD",
    });
    punctuatedTagUser = await db.User.create({
      email: `mention-punct-${stamp}@test.local`,
      display_name: "Punctuated Tag User",
      raw_role_tag: "Prod. Mgr.",
    });
    noMatchUser = await db.User.create({
      email: `mention-nomatch-${stamp}@test.local`,
      display_name: "No Match User",
      raw_role_tag: "QA",
    });
  });

  afterAll(async () => {
    await db.User.destroy({
      where: { id: [rawOnlyUser.id, manualOverrideUser.id, punctuatedTagUser.id, noMatchUser.id] },
    });
    await db.sequelize.close();
  });

  it("matches a user via raw_role_tag when there's no manual override", async () => {
    const ids = await resolveUsersByRoleTag("sd");
    expect(ids).toContain(rawOnlyUser.id);
    expect(ids).not.toContain(noMatchUser.id);
  });

  it("prefers manual_role_tag over raw_role_tag when both are set", async () => {
    const sdIds = await resolveUsersByRoleTag("sd");
    expect(sdIds).toContain(manualOverrideUser.id);

    const prodMgrIds = await resolveUsersByRoleTag("prodmgr");
    expect(prodMgrIds).not.toContain(manualOverrideUser.id);
  });

  it("normalizes case, punctuation, and spacing so a human-readable tag and a bare @token match the same users", async () => {
    const viaToken = await resolveUsersByRoleTag("prodmgr");
    const viaLabel = await resolveUsersByRoleTag("Prod. Mgr");
    expect(viaToken).toContain(punctuatedTagUser.id);
    expect(viaLabel).toContain(punctuatedTagUser.id);
  });

  it("returns an empty array for a tag nobody holds", async () => {
    const ids = await resolveUsersByRoleTag("nonexistent-tag-xyz");
    expect(ids).toEqual([]);
  });

  it("returns an empty array for a null/empty tag", async () => {
    expect(await resolveUsersByRoleTag(null)).toEqual([]);
    expect(await resolveUsersByRoleTag("")).toEqual([]);
  });
});
