import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("App", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("App");
      expect(ok).toEqual(true);
    });
  });
});
