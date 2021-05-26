import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("mark_batch_loaded_by_device_id", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("mark_batch_loaded_by_device_id");
      expect(ok).toEqual(true);
    });
  });
});
