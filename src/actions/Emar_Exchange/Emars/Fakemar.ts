import { Emar_Exchange_Action } from "./../../Parents/Emar_Exchange_Action";
import { getRepository, Repository } from "typeorm";
import { Fmar } from "./../../../entities/Fmar";

/**
 * Defines the class properties for an Emar Exchange registered interface
 */
abstract class FakeMAR_Action extends Emar_Exchange_Action {

  /**
   * YYYYmmddHHiiss
   */
  todayString: String;
  
  /**
   * Name this emar application
   */
  constructor() {
    super();
    this.emar_id =1;
    this.emar_name = "FakeMAR";
    const today = new Date();
    this.todayString = today.getFullYear() + 
      String(today.getMonth()+1).padStart(2, '0') + 
      String(today.getDate()).padStart(2,'0') +
      String(today.getHours()) +
      String(today.getMinutes()) +
      String(today.getSeconds());
  }
}

// Actions that Medherent will call
export class User_Registration extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "RegisterUser";
    this.description = "Allows Medherent to check whether a user attempting to log in is known to FakeMAR";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec (data?: any) {
    const hl7 = data.params.hl7;
    const fmarRepository = getRepository(Fmar);
    const username = hl7[1][2][0];
    const fmar = await fmarRepository.find({ where: {username: username}});
    let fmar_id = "";
    let response_code = "AA";
    let response_msg = "Accepted";
    if (fmar.length === 0) {
      response_code = "ER1";
      response_msg = " User Name not found";
    } else {
      fmar_id = String(fmar[0].id);
    }
    return { hl7: "MSH||FakeMAR|MHP|Medherent|"+hl7[0][5]+"|"+this.todayString+"||ADT^A02|-1||2.5||||||ASCII|%250A|&#xD; \
    MSA|"+response_code+"|"+response_msg+"|"+fmar_id+"|&#xD;" };
  }
}

export class Consumer_Registration extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "RegisterConsumer";
    this.description = "Registers a consumer in FakeMAR. FakeMAR returns the Consumer Id to Medherent";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec (data) {
    const hl7 = data.params.hl7;
    const fmarRepository = getRepository(Fmar);
    let response_code = "AA";
    let response_msg = "Accepted";
    let return_hl7 = "MSH||FakeMAR|MHP|Medherent|"+hl7[0][3][0]+"|"+this.todayString+"||ADT^A01|-1||2.5||||||ASCII|%250A|&#xD; \
    ";
    const aesjs = require('aes-js');
    const aesCtr = new aesjs.ModeOfOperation.ctr(process.env.APP_PII_SECRET.split(',').map(Number), new aesjs.Counter(5));
    //todo 
    const dobBytes = aesjs.utils.utf8.toBytes(hl7[1][6][0]);
    const last_4_ssnBytes = aesjs.utils.utf8.toBytes(hl7[1][22][0]);
    const dobEncryptBytes = aesCtr.encrypt(dobBytes);
    const last_4_ssnEncryptBytes = aesCtr.encrypt(last_4_ssnBytes);
    const dobEncryptedHex = aesjs.utils.hex.fromBytes(dobEncryptBytes);
    const last_4_ssnEncryptedHex = aesjs.utils.hex.fromBytes(last_4_ssnEncryptBytes);
    const fmar = await fmarRepository.find({ where: {lastName: hl7[1][5][0], dob: dobEncryptedHex, last_4_ssn: last_4_ssnEncryptedHex}});
    if (fmar.length === 0) {
      response_code = "ER1";
      response_msg = "Consumer not found";
      return_hl7 += "MSA|"+response_code+"|"+response_msg+"|&#xD;";
      return { hl7: return_hl7 };
    }
    return_hl7 += "MSA|"+response_code+"|"+response_msg+"|&#xD; \
    PID|1||"+fmar[0].patient_code+"|"+fmar[0].id+"|"+fmar[0].lastName+"|"+hl7[1][6][0]+"||||||||||||||||"+hl7[1][22][0]+"||&#xD; \
    PV1|1||FakeMAR ^^^Annapolis|&#xD; \
    ";
    if (fmar[0].schedule.length > 0) {
      for (let i = 0; i < fmar[0].schedule.length; i++) {
        return_hl7 += "TQ1|"+i+"|||"+fmar[0].schedule[i]+"|||&#xD; \
        ";
      }
    }
    return { hl7: return_hl7 };
  }
}

export class Consumer_Dispense_Times extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "GetDispenseTimes";
    this.description = "FakeMAR will notify Medherent of current dispense times. \
This will happen when the Consumer is first properly registered in FakeMAR, and \
then again whenever the dispense times change.";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec (data) {
    const hl7 = data.params.hl7;
    const fmarRepository = getRepository(Fmar);
    let response_code = "AA";
    let response_msg = "Accepted";
    let return_hl7 = "MSH||FakeMAR|MHP|Medherent|"+hl7[0][3][0]+"|"+this.todayString+"||ADT^A01|-1||2.5||||||ASCII|%250A|&#xD; \
    ";
    const fmar = await fmarRepository.find({ where: {id: hl7[1][4][0]}});
    if (fmar.length === 0) {
      response_code = "ER1";
      response_msg = "Consumer not found";
      return_hl7 += "MSA|"+response_code+"|"+response_msg+"|&#xD;";
      return { hl7: return_hl7 };
    }
    return_hl7 += "MSA|"+response_code+"|"+response_msg+"|&#xD; \
    PID|1|||"+fmar[0].id+"||||||||||||||||||||&#xD; \
    &#xD; \
    ";
    if (fmar[0].schedule.length > 0) {
      for (let i = 0; i < fmar[0].schedule.length; i++) {
        return_hl7 += "TQ1|"+i+"|||"+fmar[0].schedule[i]+"|||&#xD; \
        ";
      }
    }
    return { hl7: return_hl7 };
  }
}

export class Medpass_Event extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "MedPassEvent";
    this.description = "Normal Machine dispense event ";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec(data) {
    const hl7 = data.params.hl7;
    return { hl7: "MSH||FakeMAR|MHP|Medherent|"+hl7[0][3][0]+"|"+this.todayString+"||RDS^O13|-1||2.5||||||ASCII|%250A|&#xD; \
    MSA|AA|Accepted|&#xD;" };
  }
}

export class Contact_Information extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "contact";
    this.description = "Pass support contact information between Medherent and \
FakeMAR - Respective header segment only.";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec (data) {
    return { hl7: "MSA|AA|Mock Response" };
  }
}

export class On_Leave extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "SetAwayStatus";
    this.description = "Pass information to FakeMAR regarding a leave of absence from physical contact from the vending machine. The minimum away period is one day";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec (data) {
    return { hl7: "MSA|AA|Mock Response" };
  }
}

export class Suspend_Mode extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "SetSuspendStatus";
    this.description = "Updates FakeMAR that a consumer/device has been put into \
Suspend Mode and dispense operations are suspended, or a consumer/device in \
Suspend Mode, that dispense operations are no longer suspended.";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec (data) {
    return { hl7: "MSA|AA|Mock Response" };
  }
}

// Actions that will call Medherent
export class Override_Dispense extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "Override_Dispense";
    this.description = "Overrides are particular dose time for immediate dispense - User \
overrides one of current day's normal dispensing time. Override will be initiated \
from either FakeMAR or Medherent Web and will identify the Consumer and their respective \
dose time to override.";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec (data) {
    return { hl7: "MSA|AA|Mock Response" };
  }
}

export class Deactivate_User extends FakeMAR_Action {
  constructor() {
    super();
    this.name = "Deactivate_User";
    this.description = "Informs Medherent when a FakeMAR user is deactivated.";
    this.outputExample = { hl7: "URL encoded response" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async exec (data) {
    return { hl7: "MSA|AA|Mock Response" };
  }
}
