import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("Basic_Auth_Action", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("Basic_Auth_Action");
      expect(ok).toEqual(true);
    });
  });
});
