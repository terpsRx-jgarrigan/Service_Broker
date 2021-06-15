import { Action, action, api, log } from "actionhero";
import { On_Leave } from './Fakemar';

export class Mar_Message extends Action {
  constructor() {
    super();
    this.name = "Mar_Message";
    this.description = "Receive a message and forward to proper mar";
    this.outputExample = {};
    this.inputs = {
      system_id: {
        required: true
      },
      endpoint_name: {
        required: true
      },
      hl7: {
        required: true
      }, 
      extra: {
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
    
    let statement = "select \
      if (count(id) > 0,1,0) as result, \
      file_location, \
      class_name, \
      action_name \
    from msb_core.mar_system_endpoints \
    where system_id = " + data.params.system_id + " \
      and endpoint_name = '" + data.params.endpoint_name + "';";
    
      log(statement, "info", this.name);
    
      let query_result = await connection.query(statement);
    
    if (query_result[0].result != 1) {
      data.response.ok = false;
      data.response.body = "Unable to fulfill request";
    } else {
      data.response.ok = true;
      const action_response = await action.run<On_Leave>('On_Leave', null, data.params);
      //const action_response = await action.run<query_result[0].class_name>(query_result[0].action_name, null, data.params);
      log(JSON.stringify(action_response), "info", this.name);
      data.response.body = action_response;
    }
  }
}
