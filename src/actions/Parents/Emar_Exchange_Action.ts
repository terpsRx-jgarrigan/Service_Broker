import { Application_Action } from "./Application_Action";

export abstract class Emar_Exchange_Action extends Application_Action {
  
  /**
   * @var string
   */
  emar_name: String;
  
  /**
   * @var number
   */
  emar_id: Number;

  constructor() {
    super();
    this.name = "Emar_Exchange_Action";
    this.description = "Adds emar_name and emar_id properties to the Application_Action class";
    this.application_name = "Emar_Exchange";
  }
}