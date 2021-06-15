import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("mar_systems", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("mar_systems");
      expect(ok).toEqual(true);
    });
  });
});
