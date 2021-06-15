import { Action, api, log } from "actionhero";
import { query } from "winston";

export class Get_Mar_Systems extends Action {
  constructor() {
    super();
    this.name = "Get_Mar_Systems";
    this.description = "Returns the supported mar systems the service broker is able to distribute messages too.";
    this.outputExample = {
      supported_systems: [
        {
          id: 1,
          name: 'abc'
        },
        {
          id: 2,
          name: 'xyz'
        }
      ]
    };
    this.version = 1;
  }

  async run(data) {
    const connection = api.db_conn_mgr.get("default");
    if (connection.isConnected === false) {
      await connection.connect();
    }
    const statement = "select \
      id, \
      name \
    from msb_core.mar_systems \
    where active = 1;"
    const query_result = await connection.query(statement);
    if (query_result.length !== undefined && query_result.length > 0) {
      const response_object = { supported_systems: [] };
      query_result.forEach(element => {
        let index_object = { id: undefined, name: undefined };
        index_object.id = element.id;
        index_object.name = element.name;
        response_object.supported_systems.push(index_object);
      });
      data.response.ok = true;
      data.response.body = response_object;
    } else {
      data.response.ok = false;
      data.response.body = { message: "No systems found " };
    }
  }
}

export class Get_Mar_System_Endpoints extends Action {
  constructor() {
    super();
    this.name = "Get_Mar_System_Endpoints";
    this.description = "Describes the endpoints a system has available to call";
    this.outputExample = {
      endpoints: []
    };
    this.version = 1;
    this.inputs = {
      system_id: {
        required: true
      }
    }
  }

  async run(data) {
    log(JSON.stringify(data.params), "info", this.name);
    const connection = api.db_conn_mgr.get("default");
    if (connection.isConnected === false) {
      await connection.connect();
    }
    let statement = "select \
      endpoint_name, \
      action_input_parameters \
    from msb_core.mar_system_endpoints \
    where system_id = " + data.params.system_id + " \
      and active = 1";
    log(statement, "info", this.name);
    let query_result = await connection.query(statement);
    let response_object = {
      endpoints: []
    };
    if (query_result.length !== undefined && query_result.length > 0) {
      query_result.forEach(element => {
        response_object.endpoints.push(element);
      });
      data.response.ok = true;
      data.response.body = response_object;
    } else {
      data.response.ok = false;
      data.response.body = "No endpoints found";
    }
  }
}