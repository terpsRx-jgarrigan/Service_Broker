import { JWT_Action } from "./JWT_Action";

export abstract class Application_Action extends JWT_Action {
  /**
   * What application does this action support?
   */
  application_name: String;
  constructor() {
    super();
    this.name = "Application_Action";
    this.description = "Describes the application/service that the action is associated with";
    this.jwt_verified = true;
  }
  
  /**
   * @param data
   * @returns Promise<any> 
   */
  async run (data: any) {
    data.response.ok = true;
  }
}
