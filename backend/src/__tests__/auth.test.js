const request = require("supertest");
const app = require("../app");
const db = require("../models");

// close the connection pool afterwards so Jest can exit cleanly instead of
// hanging on an open handle
afterAll(async () => {
  await db.sequelize.close();
});

// these only exercise auth-gating and input validation, not the data
// returned, so they don't depend on (or disturb) whatever happens to be
// seeded in the database they run against
describe("authentication gating", () => {
  it("rejects a request to a protected route with no token", async () => {
    const res = await request(app).get("/api/questions");
    expect(res.status).toBe(401);
  });

  it("rejects a request with a malformed token", async () => {
    const res = await request(app)
      .get("/api/questions")
      .set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(401);
  });

  it("rejects admin-only routes for an unauthenticated caller", async () => {
    const res = await request(app).get("/api/admin/insights");
    expect(res.status).toBe(401);
  });
});

describe("input validation", () => {
  it("rejects malformed JSON bodies with a 400, not a crash", async () => {
    const res = await request(app)
      .post("/api/search")
      .set("Content-Type", "application/json")
      .send("{not valid json");
    expect(res.status).toBe(400);
  });

  it("404s on a route that doesn't exist", async () => {
    const res = await request(app).get("/api/this-route-does-not-exist");
    expect(res.status).toBe(404);
  });
});
