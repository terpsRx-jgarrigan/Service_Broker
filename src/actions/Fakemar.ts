import { Action, log } from "actionhero";

export class Medpass_Event extends Action {
  constructor() {
    super();
    this.name = "Medpass_Event";
    this.description = "Normal Machine dispense event ";
    this.outputExample = { hl7: "HL7 response text" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async run(data) {
    log("received the following: " + data.params.hl7, "info", this.name);
    return { hl7: "MSA|AA|Successful reception of the medication dispense event" };
  }
}

export class On_Leave extends Action {
  constructor() {
    super();
    this.name = "On_Leave";
    this.description = "Pass information to Fakemar regarding a leave of absence from physical contact from the vending machine. The minimum away period is one day";
    this.outputExample = { hl7: "HL7 response text" };
    this.inputs = {
      hl7: {
        required: true
      }
    };
    this.version = 1;
  }

  async run (data) {
    log("received the following: " + data.params.hl7, "info", this.name);
    return { hl7: "MSA|AA|Successful reception of the on-leave notification" };
  }
}
