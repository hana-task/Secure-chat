import request from "supertest";
import { setupTestServer } from "./test-utils";

describe("User Authentication", () => {
  let srv: any;
  let url: string;

  beforeAll(async () => {
    const s = await setupTestServer();
    srv = s;
    url = s.url;
  });

  afterAll(async () => {
    await srv.close();
  });

  it("should register and login", async () => {
    const register = await request(url)
      .post("/api/auth/register")
      .send({ username: "alice", password: "pass1234" });

    expect(register.status).toBe(201);

    const login = await request(url)
      .post("/api/auth/login")
      .send({ username: "alice", password: "pass1234" });

    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});
