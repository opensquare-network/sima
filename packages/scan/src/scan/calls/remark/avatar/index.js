const { commands } = require("../../../../spec/consts");
const { insertIpfsJob } = require("./insertIpfsJob");
const { handleAvatarUnset } = require("./unset");

async function handleAvatarCommand(signer, command, args = [], extrinsicIndexer) {
  if (command === commands.submission) {
    await insertIpfsJob(signer, commands.submission, args, extrinsicIndexer);
  } else if (command === commands.agencySubmission) {
    await insertIpfsJob(signer, commands.agencySubmission, args, extrinsicIndexer);
  } else if (command === commands.unset) {
    await handleAvatarUnset(signer, extrinsicIndexer);
  } else if (command === commands.agencyUnset) {
    await insertIpfsJob(signer, commands.agencyUnset, args, extrinsicIndexer);
  } else if (command === commands.batchAgencySubmission) {
    await insertIpfsJob(signer, commands.batchAgencySubmission, args, extrinsicIndexer);
  }
}

module.exports = {
  handleAvatarCommand,
}
