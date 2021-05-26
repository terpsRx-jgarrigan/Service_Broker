import { Process, specHelper } from "actionhero";
const actionhero = new Process();

describe("Action", () => {
  describe("rx_batch_details_by_device_id", () => {
    beforeAll(async () => {
      await actionhero.start();
    });

    afterAll(async () => {
      await actionhero.stop();
    });

    test("returns OK", async () => {
      const { ok } = await specHelper.runAction("rx_batch_details_by_device_id");
      expect(ok).toEqual(true);
    });
  });
});
