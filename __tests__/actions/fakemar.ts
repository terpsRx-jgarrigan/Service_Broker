import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("fakemar", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("fakemar");
      expect(ok).toEqual(true);
    });
  });
});
