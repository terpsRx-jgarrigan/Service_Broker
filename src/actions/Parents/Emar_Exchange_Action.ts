import { Application_Action } from "./Application_Action";

export abstract class Emar_Exchange_Action extends Application_Action {
  /**
   * what emar is this action for?
   */
  emar_name: String;
  /**
   * identifier for the emar
   */
  emar_id: Number;

  constructor () {
    super();
    this.name = "Emar_Exchange_Action";
    this.description = "Parent class for Emar_Exchange application";
    this.application_name = "Emar_Exchange";
  }

  /**
   * @param data
   * @returns Promise<any> 
   */
   async run (data: any) {
    data.response.ok = true;
  }
}