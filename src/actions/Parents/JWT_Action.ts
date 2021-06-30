import { action, Action } from "actionhero";
import * as fs from "fs";

export abstract class JWT_Action extends Action {
  /**
   * does this action require the user to be logged in?
   */
  jwt_verified: boolean;
  constructor(){
    super();
    this.name = "JWT_Action";
    this.description = "JWT authenticated actions";
  }
  
  /**
   * @param data
   * @returns Promise<any> 
   */
   async run (data: any) {
    data.response.ok = true;
  }
}

action.addMiddleware({
  name: "JWT_Auth", 
  global: true,
  preProcessor: async(data) => {
    if (data.actionTemplate.jwt_verified) {
      let jwt = require("jsonwebtoken");
      const RSA_PUBLIC_KEY = fs.readFileSync(process.env.PUBLIC_KEY_FILE);
      try {
        let jwtString = data.connection.rawConnection.req.headers.jwt;
        let decode = jwt.verify(jwtString, RSA_PUBLIC_KEY);
        console.log(decode);
      } catch (error) {
        data.response.ok = false;
        data.response.body = error;
        data.toProcess = false;
        data.connection.setStatusCode(401);
      }
    }
  }
});