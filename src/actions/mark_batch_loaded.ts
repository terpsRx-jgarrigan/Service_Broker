import { Action, api, log } from "actionhero";

export class mark_batch_loaded_by_device_id extends Action {
  constructor() {
    super();
    this.name = "mark_batch_loaded";
    this.description = "marks the load as complete";
    this.outputExample = {};
    this.inputs = {
      load_id: {
        required: true
      },
      has_remainders: {
        required: true
      },
      remainder_count: {
        required: false
      }
    }
  }

  async run(data) {
    log(JSON.stringify(data.params), "info", this.name);
    const connection = api.db_conn_mgr.get("default");
    if (connection.isConnected === false) {
      await connection.connect();
    }
    let statement = "update rx_batch_files.loads \
    set load_complete = 1 \
    where id = " + data.params.load_id;
    log(statement, "info", this.name);
    let query_result = await connection.query(statement);
    let load_updated = false;
    if (query_result.changedRows == 1) {
      load_updated = true;
    }
    let has_remainders = 0;
    if (data.params.has_remainders === true) {
      has_remainders = 1;
    }
    statement = "update rx_batch_files.batches \
    set \
      ever_been_loaded = 1, \
      has_remainders = " + has_remainders + ", \
      remainder_count = "+ data.params.remainder_count + "\
    where id = (select batch_id from rx_batch_files.batch_file_linking where id = \
      (select batch_file_linking_id from rx_batch_files.loads where id = " + data.params.load_id +"))";
    log(statement, "info", this.name);
    query_result = await connection.query(statement);
    let batch_updated = false;
    if (query_result.changedRows == 1) {
      batch_updated = true;
    }
    data.response.ok = true;
    data.response.body = [];
    if (load_updated) {
      data.response.body.push("Marked Loaded");
    }
    if (batch_updated) {
      data.response.body.push("Batch Updated");
    }
  }
}
