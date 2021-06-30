import { Emar_Exchange_Action } from "./../../Parents/Emar_Exchange_Action";

class HL7_Parse {
  
  private split_on_char(string, delimiter) {
    return ((string.search(delimiter) > -1) ? string.split(delimiter) : string);
  }
  private parse_segment(string) {
    let array = this.split_on_char(string, "|");
    for (let i = 0; i < array.length; i++) {
      array[i] = this.split_on_char(array[i], "^");
      if (typeof array[i] === 'object') {
        for (let j = 0; j < array[i].length; j++) {
          array[i][j] = this.split_on_char(array[i][j], "~");
          if (typeof array[i][j] === 'object') {
            for (let k = 0; k < array[i][j].length; k++) {
              array[i][j][k] = this.split_on_char(array[i][j][k], /\\/);
              if (typeof array[i][j][k] === 'object') {
                for (let l = 0; l < array[i][j][k].length; l++) {
                  array[i][j][k][l] = this.split_on_char(array[i][j][k][l], "&");
                }
              }
            }
          }
        }
      }
    }
    return array;
  }
  public inflate(hl7) {
    let message = hl7.split(/\r\n|\n\r|\n|\r/g);
    for(let i = 0; i < message.length; i++) {
      message[i] = this.parse_segment(message[i]);
    }
    return message;
  }
}

abstract class FakeMAR_Action extends Emar_Exchange_Action {
  constructor() {
    super();
    this.emar_id =1;
    this.emar_name = "FakeMAR";
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run (data) {
    return { hl7: encodeURIComponent("MSA|AA|Mock Response") };
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run (data) {
    return { hl7: encodeURIComponent("MSA|AA|Mock Response") };
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run (data) {
    return { hl7: encodeURI("MSA|AA|Mock Response") };
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run(data) {
    return { hl7: encodeURIComponent("MSA|AA|Mock Response") };
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run (data) {
    return { hl7: encodeURIComponent("MSA|AA|Mock Response") };
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run (data) {
    return { hl7: encodeURIComponent("MSA|AA|Mock Response") };
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run (data) {
    return { hl7: encodeURIComponent("MSA|AA|Mock Response") };
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run (data) {
    return { hl7: encodeURIComponent("MSA|AA|Mock Response") };
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
        required: true,
        formatter: (param) => {
          const parser = new HL7_Parse();
          return parser.inflate(decodeURIComponent(param));
        }
      }
    };
    this.version = 1;
  }

  async run (data) {
    return { hl7: encodeURIComponent("MSA|AA|Mock Response") };
  }
}
