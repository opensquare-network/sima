const { get10AvatarNonBatchJobs } = require("./fetch");
const { commands } = require("../../spec/consts/commands");
const { handleAgencySubmission } = require("./agencySubmission");
const { handleAgencyUnset } = require("./agencyUnset");

async function doAvatarJobs() {
  doAvatarNonBatchJobs().then(() => console.log(`avatar non batch jobs finished`));
}

async function doAvatarNonBatchJobs() {
  const avatarNonBatchJobs = await get10AvatarNonBatchJobs();
  const promises = avatarNonBatchJobs.map(job => handleOneAvatarJob(job));
  await Promise.all(promises);
}

async function handleOneAvatarJob(job) {
  if (commands.agencySubmission === job.command) {
    await handleAgencySubmission(job);
  } else if (commands.agencyUnset === job.command) {
    await handleAgencyUnset(job);
  }
}

module.exports = {
  doAvatarJobs,
  doAvatarNonBatchJobs,
}
