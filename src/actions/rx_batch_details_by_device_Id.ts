import { Action, api, log } from "actionhero";
import { rx_batch_file_by_device_id } from "../contracts/rx_batch_file_by_device_id";
export class rx_batch_details_by_device_id extends Action {
  constructor() {
    super();
    this.name = "rx_batch_details_by_device_id";
    this.description = "Returns the latest information about the device according to the Rx software";
    this.outputExample = {
      patient_id: 123,
      device_id: 456,
      latest_batch_number: "ERF4443333",
      bag_numbers: [
        12,
        13,
        14,
        15
      ],
      loaded_at: "2021-05-17 19:38:00"
    };
    this.version = 1;
    this.inputs = {
      device_id: { 
        required: true,
        validator: (param, connection, actionTemplate) => {
          return isNaN(param) ? false : true;
        },
        formatter: (param, connection, actionTemplate) =>  {
          return parseInt(param);
        },
      }
    }
  }

  async run(data) {
    const connection = api.db_conn_mgr.get("default");
    if (connection.isConnected === false) {
      await connection.connect();
    }
    const statement = "select \
      p.patient_id, \
      p.device_id, \
      b.batch_number, \
      b.bag_numbers, \
      b.ever_been_loaded, \
      b.has_remainders, \
      b.remainder_count, \
      f.created_at as uploaded_at, \
      l.id as load_id \
    from rx_batch_files.patients p \
      join rx_batch_files.loads l on p.id = l.patient_id \
      join rx_batch_files.batch_file_linking bfl on l.batch_file_linking_id = bfl.id \
      join rx_batch_files.batches b on bfl.batch_id = b.id \
      join rx_batch_files.files f on bfl.file_id = f.id \
      where p.device_id = " + data.params.device_id + " \
      and l.load_complete = 0";
    log(statement, "info", this.name);
    const query_result = await connection.query(statement);
    if (query_result.length !== undefined && query_result.length > 0 ) {
      const response_object = new rx_batch_file_by_device_id();
      response_object.inflate(query_result);
      data.response.ok = true;
      data.response.body = response_object;
    } else {
      data.response.ok = false;
      data.response.body = { message: "No loads found " };
    }
  }
}
