import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("Job", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("Job");
      expect(ok).toEqual(true);
    });
  });
});
