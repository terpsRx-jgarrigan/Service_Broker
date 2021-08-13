import { Action, api, log } from "actionhero";
import { getManager } from "typeorm";
import { User } from "./../entities/User";

export class Register extends Action {
  constructor() {
    super();
    this.name = "Register";
    this.description = "register a user";
    this.outputExample = {};
    this.inputs = {};
  }

  async run(data) {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const entityManager = getManager();
    const user = new User();
    let authentication = data.connection.rawConnection.req.headers.authorization.replace(/^Basic/, '');
    authentication = Buffer.from(authentication, 'base64').toString().split(':');
    user.email = authentication[0];
    const hash = bcrypt.hashSync(authentication[1], saltRounds);
    user.hash = hash;
    await entityManager.save(user);
  }
}

export class Authenticate extends Action {
  constructor() {
    super();
    this.name = "Authenticate";
    this.description = "authenticate with the api and get a jwt";
    this.outputExample = {};
    this.inputs = {};
  }

  async run(data) {
    data.response.ok = false;
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const entityManager = getManager();
    let authentication = data.connection.rawConnection.req.headers.authorization.replace(/^Basic/, '');
    authentication = Buffer.from(authentication, 'base64').toString().split(':'); 
    const user: User = await entityManager.findOne(User, { where: {email: authentication[0], is_active: 1}});
    if (user.id !== undefined) {
      if (bcrypt.compareSync(authentication[1], user.hash.toString())) {
        data.response.ok = true;
        data.response.body = jwt.sign({
          id: user.id,
          email: user.email
        }, process.env.APP_JWT_SECRET, {expiresIn: '1h'});
      } else {
        data.response.body = { message: "hash error" };
      }
    } else {
      data.response.body = { message: "couldn't find user" };
    }
  }
}
