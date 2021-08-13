import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("Fmar", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("Fmar");
      expect(ok).toEqual(true);
    });
  });
});
