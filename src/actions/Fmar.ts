import { Application_Action } from "./Parents/Application_Action";
import { getRepository } from "typeorm";
import { Fmar } from "../entities/Fmar";

export class CreateFmar extends Application_Action {
  constructor() {
    super();
    this.name = "CreateFmar";
    this.description = "an interface for managing fmars that are registered on the FakeMAR";
    this.inputs = {
      patient_code: {required: false},
      username: {required: true},
      firstName: {required: true},
      lastName: {required: true},
      dob: {required: true},
      last_4_ssn: {required: true},
      schedule: {required: true},
      info: {required: false},
    };
    this.outputExample = {};
    this.application_name = "FakeMAR";
  }

  async run(data) {
    const aesjs = require('aes-js');
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      process.env.APP_PII_SECRET.split(',').map(Number), 
      new aesjs.Counter(5));
    const dobBytes = aesjs.utils.utf8.toBytes(data.params.dob);
    const last_4_ssnBytes = aesjs.utils.utf8.toBytes(data.params.last_4_ssn);
    const dobEncryptBytes = aesCtr.encrypt(dobBytes);
    const last_4_ssnEncryptBytes = aesCtr.encrypt(last_4_ssnBytes);
    const dobEncryptedHex = aesjs.utils.hex.fromBytes(dobEncryptBytes);
    const last_4_ssnEncryptedHex = aesjs.utils.hex.fromBytes(last_4_ssnEncryptBytes);
    const fmarRepository = getRepository(Fmar);
    let fmar = {
      patient_code: data.params.patient_code,
      username: data.params.username,
      firstName: data.params.firstName,
      lastName: data.params.lastName,
      dob: dobEncryptedHex,
      last_4_ssn: last_4_ssnEncryptedHex,
      schedule: data.params.schedule,
      info: data.params.info
    };
    if (fmar.info === undefined) {
      fmar.info = {};
    }
    data.response.body = await fmarRepository.save(fmar);
    data.connection.setStatusCode(201);
    data.response.ok = true;
  }
}

export class UpdateFmar extends Application_Action {
  constructor() {
    super();
    this.name = "UpdateFmar";
    this.description = "an interface for managing fmars that are registered on the FakeMAR";
    this.outputExample = {};
    this.inputs = {
      fmar_id: {required: true},
      patient_code: {required: false},
      username: {required: true},
      firstName: {required: true},
      lastName: {required: true},
      dob: {required: true},
      last_4_ssn: {required: true},
      schedule: {required: true},
      info: {required: false},
    };
    this.application_name = "FakeMAR";
  };

  async run(data) {
    const aesjs = require('aes-js');
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      process.env.APP_PII_SECRET.split(',').map(Number), 
      new aesjs.Counter(5));
    const dobBytes = aesjs.utils.utf8.toBytes(data.params.dob);
    const last_4_ssnBytes = aesjs.utils.utf8.toBytes(data.params.last_4_ssn);
    const dobEncryptBytes = aesCtr.encrypt(dobBytes);
    const last_4_ssnEncryptBytes = aesCtr.encrypt(last_4_ssnBytes);
    const dobEncryptedHex = aesjs.utils.hex.fromBytes(dobEncryptBytes);
    const last_4_ssnEncryptedHex = aesjs.utils.hex.fromBytes(last_4_ssnEncryptBytes);
    const fmarRepository = getRepository(Fmar);
    let fmar = {
      patient_code: data.params.patient_code,
      username: data.params.username,
      lastName: data.params.lastName,
      firstName: data.params.firstName,
      dob: dobEncryptedHex,
      last_4_ssn: last_4_ssnEncryptedHex,
      schedule: data.params.schedule,
      info: data.params.info
    };
    if (fmar.info === undefined) {
      fmar.info = {};
    }
    await fmarRepository.update(Number(data.params.fmar_id), fmar);
    data.response.body = await fmarRepository.find({id: Number(data.params.fmar_id)});
    data.response.ok = true;
  }
}

export class ReadFmar extends Application_Action {
  constructor() {
    super();
    this.name = "ReadFmar";
    this.description = "an interface for managing fmars that are registered on the FakeMAR";
    this.outputExample = {};
    this.inputs = {
      fmar_id: {required: false}
    };
    this.application_name = "FakeMAR";
  }

  async run(data) {
    const fmarRepository = getRepository(Fmar);
    if (data.params.fmar_id !== undefined) {
      data.response.body = await fmarRepository.find({id: Number(data.params.fmar_id)});
    } else {
      data.response.body = await fmarRepository.find();
    }
    data.response.ok = true;
  }
}

export class DeleteFmar extends Application_Action {
  constructor() {
    super();
    this.name = "DeleteFmar";
    this.description = "an interface for managing fmars that are registered on the FakeMAR";
    this.outputExample = {};
    this.inputs = {
      fmar_id: {required: true}
    };
    this.application_name = "FakeMAR";
  }

  async run(data) {
    const fmarRepository = getRepository(Fmar);
    await fmarRepository.delete(data.params.fmar_id);
    data.response.ok = true;
  }
}