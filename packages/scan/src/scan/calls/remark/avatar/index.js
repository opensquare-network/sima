const { commands } = require("../../../../spec/consts");
const { insertAgencyJob } = require("./insertIpfsJob");
const { handleAvatarUnset } = require("./unset");
const { handleSubmission } = require("./submission");

async function handleAvatarCommand(signer, command, args = [], extrinsicIndexer) {
  if (command === commands.submission) {
    await handleSubmission(signer, args, extrinsicIndexer);
  } else if (command === commands.agencySubmission) {
    await insertAgencyJob(signer, commands.agencySubmission, args, extrinsicIndexer);
  } else if (command === commands.unset) {
    await handleAvatarUnset(signer, extrinsicIndexer);
  } else if (command === commands.agencyUnset) {
    await insertAgencyJob(signer, commands.agencyUnset, args, extrinsicIndexer);
  } else if (command === commands.batchAgencySubmission) {
    await insertAgencyJob(signer, commands.batchAgencySubmission, args, extrinsicIndexer);
  }
}

module.exports = {
  handleAvatarCommand,
}
