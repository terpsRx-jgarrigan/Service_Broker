import { Action, api, log } from "actionhero";

class Machine_Loading_Portal_Response_Body {
  public patient_id = "";
  public medherent_id = "";
  public loads = [];

  inflate (data) {
    this.patient_id = data[0].patient_id;
    this.medherent_id = data[0].medherent_id;
    data.forEach (element => {
      let index_object = {
        load_id: Number,
        batch_number: String,
        bag_numbers: Array,
        ever_loaded_before: Boolean,
        has_remainders: Boolean, 
        remainder_count: Number,
        uploaded_at: Date,
      };
      index_object.load_id = element.load_id;
      index_object.batch_number = element.batch_number;
      index_object.bag_numbers = JSON.parse(element.bag_numbers);
      index_object.ever_loaded_before = element.ever_been_loaded;
      index_object.has_remainders = element.has_remainders;
      index_object.remainder_count = element.remainder_count;
      index_object.uploaded_at = element.uploaded_at;
      this.loads.push(index_object);
    });
  }
}

export class Get_Medherent_ID_Load_Details extends Action {
  constructor() {
    super();
    this.name = "Get_Medherent_ID_Load_Details";
    this.description = "Returns the latest information about the Medherent ID according to the Rx software";
    this.outputExample = {
      patient_id: "123",
      medherent_id: "123",
      latest_batch_number: "123",
      bag_numbers: [],
      loaded_at: "2020-06-25 11:25:25",
    };
    this.version = 1;
    this.inputs = {
      medherent_id: { 
        required: true,
        validator: (param, connection, actionTemplate) => {
          return isNaN(param) ? false : true;
        },
        formatter: (param, connection, actionTemplate) =>  {
          return parseInt(param);
        },
      }
    };
    this.middleware = ["JWT_Auth"];
  }
  
  async run(data) {
    const connection = api.db_conn_mgr.get("default");
    if (connection.isConnected === false) {
      await connection.connect();
    }
    const statement = "select \
      p.patient_id, \
      p.medherent_id, \
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
      where p.medherent_id = ? \
      and l.load_complete = 0";
    const query_result = await connection.query(statement, [data.params.medherent_id]);
    if (query_result.length !== undefined && query_result.length > 0) {
      data.response.ok = true;
      data.response.body = new Machine_Loading_Portal_Response_Body();
      data.response.body.inflate(query_result);
    } else {
      data.response.ok = false;
      data.response.body = { message: "No Loads Found" };
    }
  }
}

export class Mark_Load_As_Loaded extends Action {
  constructor() {
    super();
    this.name = "Mark_Load_As_Loaded";
    this.description = "Interface for the Machine_Loading_Portal to mark a load as loaded";
    this.outputExample = {
      message: "success message",
      load_updated: true,
      batch_updated: true,
    };
    this.inputs = {
      load_id: {
        required: true
      },
      has_remainders: {
        required: true
      },
      remainder_count: {
        required: true
      }
    };
  }
  async run(data) {
    const connection = api.db_conn_mgr.get("default");
    if (connection.isConnected === false) {
      await connection.connect();
    }
    let statement = "update rx_batch_files.loads set load_complete = 1 where id = ?";
    let query_result = await connection.query(statement, [data.params.load_id]);
    let load_updated = false;
    if (query_result.changedRows !== undefined && query_result.changedRows == 1) {
      load_updated = true;
    }
    let has_remainders = 0;
    if (data.params.has_remainders === true) {
      has_remainders = 1;
    }
    statement = "update rx_batch_files.batches set ever_been_loaded = 1, \
      has_remainders = ?, remainder_count = ? where id = (select batch_id from \
      rx_batch_files.batch_fil_linking where id = (select batch_file_linking_id \
      from rx_batch_files.loads where id = ?))";
    query_result = await connection.query(statement, 
      [has_remainders, data.params.remainder_count, data.params.load_id]);
    let batch_updated = false;
    if (query_result.changedRows !== undefined && query_result.changedRows == 1) {
      batch_updated = true;
    }
    data.response.ok = true;
    data.response.body = { message: "", load_updated: load_updated, batch_updated: batch_updated };
  }
}
