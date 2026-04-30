const request = require("supertest");
const app = require("../app");

describe("Auth API", () => {
  it("Signup", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test",
      email: "test@test.com",
      password: "123456"
    });

    expect(res.statusCode).toBe(200);
  });
});