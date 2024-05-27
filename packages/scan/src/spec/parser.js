const {
  specName,
  specSections,
  avatarVersions,
  delegationVersions,
  avatarCommands,
  delegationCommands,
} = require("./consts");

class SimaSpecParser {
  #remark;
  #valid = false;
  #parsed = false;
  #section;
  #command;
  #args = [];

  constructor(remark = "") {
    this.#remark = remark;
    this.#parse();
    this.#parsed = true;
  }

  #isVersionValid(version, section) {
    if (!/^\d*$/.test(version)) {
      return false;
    }

    const normalizedVersion = parseInt(version);
    if (specSections.avatar === section) {
      return avatarVersions.includes(normalizedVersion);
    } else if (specSections.delegation === section) {
      return delegationVersions.includes(normalizedVersion);
    }

    return false;
  }

  #isCommandValid(section, version, command) {
    let versionedCommands = [];
    if (specSections.avatar === section) {
      versionedCommands = avatarCommands;
    } else if (specSections.delegation === section) {
      versionedCommands = delegationCommands;
    }

    const versionedCommand = versionedCommands.find(item => item.version === parseInt(version));
    return (versionedCommand?.commands || []).includes(command);
  }

  #parse() {
    if (typeof this.#remark !== 'string') {
      this.#valid = false;
      return
    }

    const items = this.#remark.split(":");
    if (specName !== items[0]) {
      this.#valid = false
      return;
    }
    const section = items[1];
    if (!Object.values(specSections).includes(section)) {
      this.#valid = false
      return;
    }
    const version = items[2];
    if (!this.#isVersionValid(version, section)) {
      this.#valid = false;
      return;
    }
    const command = items[3];
    if (!this.#isCommandValid(section, version, command)) {
      this.#valid = false;
      return;
    }

    this.#section = section;
    this.#command = command;
    this.#args = items.slice(4);
    this.#valid = true;
  }

  get isValid() {
    return this.#valid;
  }

  get section() {
    return this.#section;
  }

  get command() {
    return this.#command;
  }

  get args() {
    return this.#args;
  }
}

module.exports = {
  SimaSpecParser,
};
