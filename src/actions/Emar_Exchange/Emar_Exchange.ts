import { api } from "actionhero";
import { Emar_Exchange_Action } from "../Parents/Emar_Exchange_Action";
import { Application_Action } from "./../Parents/Application_Action";

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
      system_id: { required: true },
      endpoint: { required: true },
      hl7: { required: true }
    };
  }

  async run(data) {
    try {
      const action = Get_Emar_Action(data.params.endpoint);
      data.response.body = await action.exec(data.params.hl7);
      data.response.ok = true;
    } catch (err) {
      data.response.ok = false;
      data.response.body = err;
    }
  }
}