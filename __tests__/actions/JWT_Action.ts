import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("JWT_Action", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("JWT_Action");
      expect(ok).toEqual(true);
    });
  });
});
