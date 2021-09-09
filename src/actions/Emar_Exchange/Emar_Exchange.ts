import { api } from "actionhero";
import { Emar_Exchange_Action } from "../Parents/Emar_Exchange_Action";
import { Application_Action } from "./../Parents/Application_Action";

/**
 * Tool to interpret HL7 text
 */
class HL7_Parse {
  
  /**
   * Splits the string on a provided delimiter 
   * @param string 
   * @param delimiter 
   * @returns 
   */
  private split_on_char(string, delimiter) {
    return ((string.search(delimiter) > -1) ? string.split(delimiter) : string);
  }

  /**
   * Orchestrates the deconstruction of the provided segment
   * @param string 
   * @returns 
   */
  private parse_segment(string) {
    let array = this.split_on_char(string, "|");
    for (let i = 0; i < array.length; i++) {
      array[i] = this.split_on_char(array[i], "^");
      if (typeof array[i] === 'object') {
        for (let j = 0; j < array[i].length; j++) {
          array[i][j] = this.split_on_char(array[i][j], "~");
          if (typeof array[i][j] === 'object') {
            for (let k = 0; k < array[i][j].length; k++) {
              array[i][j][k] = this.split_on_char(array[i][j][k], /\\/);
              if (typeof array[i][j][k] === 'object') {
                for (let l = 0; l < array[i][j][k].length; l++) {
                  array[i][j][k][l] = this.split_on_char(array[i][j][k][l], "&");
                }
              }
            }
          }
        }
      }
    }
    return array;
  }

  /**
   * Orchestrates the deconstruction of the provided message
   * @param hl7 
   * @returns 
   */
  public inflate(hl7) {
    let message = hl7.split(/\r\n|\n\r|\n|\r/g);
    for(let i = 0; i < message.length; i++) {
      message[i] = this.parse_segment(message[i]);
    }
    return message;
  }
}

class Exchange_Application {
  public id: Number;
  public name: String;
  public endpoints: any[];
}

class Application_Endpoint {
  public name: String;
  public description: String;
}

function Get_Distinct_Emars () {
  let emar_exchange_applications = [];
  let response_arr = [];
  Object.keys(api.actions.actions).forEach((actionName) => {
    Object.keys(api.actions.actions[actionName]).forEach((version) => {
      const action = <Emar_Exchange_Action>api.actions.actions[actionName][version];
      if (
        typeof action.application_name == "string" && 
        action.application_name == 'Emar_Exchange' &&
        typeof action.emar_name == "string" &&
        typeof action.emar_id == "number" &&
        emar_exchange_applications.indexOf(action.emar_name) == -1
      ) {
        emar_exchange_applications.push(action.emar_name);
        let obj = new Exchange_Application();
        obj.id = action.emar_id;
        obj.name = action.emar_name;
        obj.endpoints = Get_Emar_Endpoints(action.emar_name);
        response_arr.push(obj);
      }
    });
  });
  return response_arr;
}

function Get_Emar_Endpoints (emar: string) {
  let endpoints = [];
  Object.keys(api.actions.actions).forEach((actionName) => {
    Object.keys(api.actions.actions[actionName]).forEach((version) => {
      const action = <Emar_Exchange_Action>api.actions.actions[actionName][version];
      if (
        typeof action.application_name == "string" && 
        action.application_name == 'Emar_Exchange' &&
        typeof action.emar_name == "string" &&
        action.emar_name == emar && 
        endpoints.indexOf(action.name) == -1
      ) {
        let obj = new Application_Endpoint();
        obj.name = action.name;
        obj.description = action.description;
        endpoints.push(obj);
      }
    });
  });
  return endpoints;
}

function Get_Emar_Action (action: string) {
  let ret_action = undefined;
  Object.keys(api.actions.actions).forEach((actionName) => {
    Object.keys(api.actions.actions[actionName]).forEach((version) => {
      if (action == actionName) {
        ret_action =  api.actions.actions[actionName][version];
      }
    });
  });
  return ret_action;
}

export class Emar_Exchange_Directory extends Application_Action {
  constructor() {
    super();
    this.application_name = "Emar_Exchange";
    this.name = "Emar_Exchange_Directory";
    this.description = "Lists all Emar's currently available on the exchange.";
    this.outputExample = {};
    this.version = 1;
  }

  async run(data) {
    try {
      let response_arr = Get_Distinct_Emars();
      data.response.ok = true;
      data.response.body = response_arr; 
    } catch (err) {
      data.response.ok = false;
      data.response.body = err;
    }
  }
}

export class Emar_Exchange_Execute extends Application_Action {
  constructor() {
    super();
    this.application_name = "Emar_Exchange";
    this.name = "Emar_Exchange_Execute";
    this.description = "Executes an endpoint of an Emar";
    this.version = 1;
    this.inputs = {
      system_name: { required: true },
      endpoint: { required: true },
      hl7: { 
        required: false,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(param);
        } 
      }
    };
  }

  async run(data) {
    try {
      let pass_obj = {
        params: {
          hl7: []
        }
      };
      let hl7_provided = false;
      if (data.params.hl7 != undefined) {
        hl7_provided = true;
        pass_obj.params.hl7 = data.params.hl7;
      } else if (data.connection.rawConnection.req.headers.hl7transactionheader != undefined &&
          data.connection.rawConnection.req.headers.hl7body != undefined) {
        hl7_provided = true;
        const parser = new HL7_Parse();
        pass_obj.params.hl7 = parser.inflate(data.connection.rawConnection.req.headers.hl7transactionheader+ "\n" + data.connection.rawConnection.req.headers.hl7body);
      } else {
        data.connection.setStatusCode(401);
        throw new Error("hl7 missing");
      }
      const action = Get_Emar_Action(data.params.endpoint);
      data.response.body = await action.exec(pass_obj);
      data.response.ok = true;
    } catch (err) {
      data.response.ok = false;
      data.response.body = err.message;
    }
  }
}