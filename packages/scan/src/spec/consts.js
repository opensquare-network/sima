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
    commands: ["S", "AS", "U", "AU", "BAS"],
  },
];

const delegationVersions = [1];
const delegationCommands = [
  {
    version: 1,
    commands: ["S", "AS", "U", "AU", "BAS"],
  },
];

module.exports = {
  specSections,
  specName,
  avatarVersions,
  delegationVersions,
  avatarCommands,
  delegationCommands,
}
