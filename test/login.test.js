import request from "supertest";
import app from "../src/app.js"; // Adjust the path to your app.js file

describe("POST /api/v1/auth/login", () => {
  it("should return 200 and accessToken for valid credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "rahis77u@gmail.com",
      password: "dfd435fd@wW@WW",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should return 400 for missing email or password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "" });

    expect(res.statusCode).toBe(400);
  });

  it("should return 401 for invalid credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "wrong@mail.com",
      password: "wrong@123Password",
    });

    expect(res.statusCode).toBe(401);
  });
});
