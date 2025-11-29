import request from "supertest";
import { setupTestServer } from "./test-utils";

describe("Message Broadcasting (Long Polling)", () => {
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

  it("should deliver new messages via long polling", async () => {
    const subscribePromise = request(url)
      .get("/api/messages/subscribe")
      .timeout(30000);

    await request(url)
      .post("/api/messages/send")
      .send({
        text: "Hello from test",
        senderId: "tester1"
      })
      .expect(201);

    const res = await subscribePromise;

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].text).toBe("Hello from test");
    expect(res.body[0].senderId).toBe("tester1");
  });
});
