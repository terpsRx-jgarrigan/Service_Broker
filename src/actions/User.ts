
import { JWT_Action } from "./Parents/JWT_Action";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

export class UpdateUser extends JWT_Action {
  constructor() {
    super();
    this.name = "UpdateUser";
    this.description = "an interface for managing users that are registered on the service-broker";
    this.outputExample = {};
    this.inputs = {
      user_id: { required: true },
      email: { required: true },
      is_active: { required: true },
    };
    this.jwt_verified = true;
  };

  async run(data) {
    const userRepository = getRepository(User);
    let user = {
      email: data.params.email,
      is_active: data.params.is_active,
    };
    await userRepository.update(Number(data.params.user_id), user);
    data.response.body = await userRepository.find({id: Number(data.params.user_id)});
    data.response.ok = true;
  }
}

export class ReadUser extends JWT_Action {
  constructor() {
    super();
    this.name = "ReadUser";
    this.description = "an interface for managing users that are registered on the service-broker";
    this.outputExample = {};
    this.inputs = {
      user_id: {required: false}
    };
    this.jwt_verified = true;
  }

  async run(data) {
    const userRepository = getRepository(User);
    if (data.params.user_id !== undefined) {
      data.response.body = await userRepository.find({id: Number(data.params.user_id)});
    } else {
      data.response.body = await userRepository.find();
    }
    data.response.ok = true;
  }
}

export class DeleteUser extends JWT_Action {
  constructor() {
    super();
    this.name = "DeleteUser";
    this.description = "an interface for managing users that are registered on the service-broker";
    this.outputExample = {};
    this.inputs = {
      user_id: {required: true}
    };
    this.jwt_verified = true;
  }

  async run(data) {
    const userRepository = getRepository(User);
    await userRepository.delete(data.params.user_id);
    data.response.ok = true;
  }
}
