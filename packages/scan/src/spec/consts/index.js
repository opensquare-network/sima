const commands = require("./commands");
const specSections = {
  "avatar": "A",
  "delegation": "D",
  // "governance": "G",
}

const specName = "SIMA";

const avatarVersions = [1];
const avatarCommands = [
  {
    version: 1,
    commands: [
      commands.submission,
      commands.agencySubmission,
      commands.unset,
      commands.agencyUnset,
      commands.batchAgencySubmission,
    ],
  },
];

const delegationVersions = [1];
const delegationCommands = [
  {
    version: 1,
    commands: [
      commands.submission,
      commands.agencySubmission,
      commands.unset,
      commands.agencyUnset,
      commands.batchAgencySubmission,
    ],
  },
];

module.exports = {
  specSections,
  specName,
  avatarVersions,
  delegationVersions,
  avatarCommands,
  delegationCommands,
  commands,
}
