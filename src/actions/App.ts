import { JWT_Action } from "./Parents/JWT_Action";
import { getRepository } from "typeorm";
import { App } from "../entities/App";

export class CreateApp extends JWT_Action {
  constructor() {
    super();
    this.name = "CreateApp";
    this.description = "an interface for managing applications that are interdependent on the service-broker";
    this.inputs = {
      name: { required: true },
      href: { required: true },
    };
    this.jwt_verified = true;
    this.outputExample = {};
  }

  async run(data) {
    const appRepository = getRepository(App);
    let app = {
      name: data.params.name,
      href: data.params.href
    };
    data.response.body = await appRepository.save(app);
    data.connection.setStatusCode(201);
    data.response.ok = true;
  }
}

export class UpdateApp extends JWT_Action {
  constructor() {
    super();
    this.name = "UpdateApp";
    this.description = "an interface for managing applications that are interdependent on the service-broker";
    this.outputExample = {};
    this.inputs = {
      app_id: {required: true},
      name: {required: true},
      href: {required: true},
    };
    this.jwt_verified = true;
  };

  async run(data) {
    const appRepository = getRepository(App);
    let app = {
      name: data.params.name,
      href: data.params.href
    };
    await appRepository.update(Number(data.params.id), app);
    data.response.body = await appRepository.find({id: Number(data.params.app_id)});
    data.response.ok = true;
  }
}

export class ReadApp extends JWT_Action {
  constructor() {
    super();
    this.name = "ReadApp";
    this.description = "an interface for managing applications that are interdependent on the service-broker";
    this.outputExample = {};
    this.inputs = {
      app_id: {required: false}
    };
    this.jwt_verified = true;
  }

  async run(data) {
    const appRepository = getRepository(App);
    if (data.params.app_id !== undefined) {
      data.response.body = await appRepository.find({id: Number(data.params.app_id)});
    } else {
      data.response.body = await appRepository.find();
    }
    data.response.ok = true;
  }
}

export class DeleteApp extends JWT_Action {
  constructor() {
    super();
    this.name = "DeleteApp";
    this.description = "an interface for managing applications that are interdependent on the service-broker";
    this.outputExample = {};
    this.inputs = {
      app_id: { required: true}
    };
    this.jwt_verified = true;
  }

  async run(data) {
    const appRepository = getRepository(App);
    await appRepository.delete(data.params.app_id);
    data.response.ok = true;
  }
}