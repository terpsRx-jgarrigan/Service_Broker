import { JWT_Action } from "./JWT_Action";

export abstract class Application_Action extends JWT_Action {
  
  /**
   * @var string
   */
  application_name: String;
  constructor(){
    super();
    this.name="Application_Action";
    this.description="Adds application_name property to Action Class";
    this.jwt_verified=true;
  }
}
