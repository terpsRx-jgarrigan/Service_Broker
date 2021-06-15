import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("Mar_Message", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("Mar_Message");
      expect(ok).toEqual(true);
    });
  });
});
