import { Action, api, log } from "actionhero";
import * as fs from "fs";

export class Register extends Action {
  constructor() {
    super();
    this.name = "Register";
    this.description = "register a user";
    this.outputExample = {};
    this.inputs = {
      user: {
        required: true
      },
      pass: {
        required: true
      }
    };
  }

  async run(data) {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const statement = "insert into msb_core.users (username, password) VALUES (?,?)";
    const connection = api.db_conn_mgr.get("default");
    if (connection.isConnected === false) {
      await connection.connect();
    }
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) throw err
      bcrypt.hash(data.params.pass, salt, (err, hash) => {
        if (err) throw err
        log(hash, "info", "callback");
        connection.query(statement, [data.params.user, hash]);
      });
    }); 
  }
}

export class Authenticate extends Action {
  constructor() {
    super();
    this.name = "Authenticate";
    this.description = "authenticate with the api and get a jwt";
    this.outputExample = {};
    this.inputs = {
      user: {
        required: true
      },
      pass: {
        required: true
      }
    };
  }

  async run(data) {
    data.response.ok = false;
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const connection = api.db_conn_mgr.get("default");
    const RSA_PRIVATE_KEY = fs.readFileSync(process.env.PRIVATE_KEY_FILE);
    if (connection.isConnected === false) {
      await connection.connect();
    }
    const statement = "select \
      id, \
      password \
    from msb_core.users \
    where username = '" + data.params.user + "'\
      and active = 1";
    const query_result = await connection.query(statement);
    if (query_result.length !== undefined && query_result.length > 0 ) {
      if (bcrypt.compareSync(data.params.pass, query_result[0].password)) {
        data.response.ok = true;
        data.response.body = jwt.sign({}, RSA_PRIVATE_KEY, {
          algorithm: 'RS256',
          expiresIn: "1h",
          subject: query_result[0].id.toString() 
        });
      } else {
        data.response.body = { message: "Hash error" };
      }
    } else {
      data.response.body = { message: "Couldn't find this user" };
    }
  }
}
