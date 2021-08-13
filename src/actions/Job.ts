import { JWT_Action } from "./Parents/JWT_Action";
import { getRepository } from "typeorm";
import { Job } from "../entities/Job";

export class CreateJob extends JWT_Action {
  constructor() {
    super();
    this.name = "CreateJob";
    this.description = "an interface for managing jobs that are registered on the service-broker";
    this.inputs = {
      user_id: { required: true },
      app_id: { required: true },
    };
    this.jwt_verified = true;
    this.outputExample = {};
  }

  async run(data) {
    const jobRepository = getRepository(Job);
    let job = {
      user_id: data.params.user_id,
      app_id: data.params.app_id
    };
    data.response.body = await jobRepository.save(job);
    data.connection.setStatusCode(201);
    data.response.ok = true;
  }
}

export class UpdateJob extends JWT_Action {
  constructor() {
    super();
    this.name = "UpdateJob";
    this.description = "an interface for managing jobs that are registered on the service-broker";
    this.outputExample = {};
    this.inputs = {
      job_id: { required: true}, 
      user_id: {required: true},
      app_id: {required: true},
      is_closed: {required: true},
    };
    this.jwt_verified = true;
  };

  async run(data) {
    const jobRepository = getRepository(Job);
    let job = {
      user_id: data.params.user_id,
      app_id: data.params.app_id,
      is_closed: data.params.is_closed,
    };
    await jobRepository.update(Number(data.params.job_id), job);
    data.response.body = await jobRepository.find({id: Number(data.params.job_id)});
    data.response.ok = true;
  }
}

export class ReadJob extends JWT_Action {
  constructor() {
    super();
    this.name = "ReadJob";
    this.description = "an interface for managing jobs that are registered on the service-broker";
    this.outputExample = {};
    this.inputs = {
      job_id: {required: false}
    };
    this.jwt_verified = true;
  }

  async run(data) {
    const jobRepository = getRepository(Job);
    if (data.params.job_id !== undefined) {
      data.response.body = await jobRepository.find({id: Number(data.params.job_id)});
    } else {
      data.response.body = await jobRepository.find();
    }
    data.response.ok = true;
  }
}

export class DeleteJob extends JWT_Action {
  constructor() {
    super();
    this.name = "DeleteJob";
    this.description = "an interface for managing jobs that are registered on the service-broker";
    this.outputExample = {};
    this.inputs = {
      job_id: {required: true}
    };
    this.jwt_verified = true;
  }

  async run(data) {
    const jobRepository = getRepository(Job);
    await jobRepository.delete(data.params.job_id);
    data.response.ok = true;
  }
}