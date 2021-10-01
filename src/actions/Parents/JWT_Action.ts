import { action, Action } from "actionhero";

export abstract class JWT_Action extends Action {

  /**
   * whether or not to execute the JWT_Auth middleware
   */
  jwt_verified: boolean;

  constructor(){
    super();
    this.name = "JWT_Action";
    this.description = "Adds middleware to ensure a valid JWT token was received";
  }

  async run (data?: any) {}
}

/**
 * Verify that a json web token was received and is valid
 */
action.addMiddleware({
  name: "JWT_Auth", 
  global: true,
  preProcessor: async(data) => {
    if (data.actionTemplate.jwt_verified) {
      let jwt = require("jsonwebtoken");
      try {
        let jwtString = data.connection.rawConnection.req.headers.authorization;
        jwtString = jwtString.replace(/^Bearer /,'');
        let decode = jwt.verify(jwtString, process.env.APP_JWT_SECRET);
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