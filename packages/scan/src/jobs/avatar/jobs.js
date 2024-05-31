const { getAvatarNonBatchJobs, getAvatarBatchJobs, getAvatarEntityJobs } = require("./fetch");
const { commands } = require("../../spec/consts/commands");
const { handleAgencySubmission } = require("./agencySubmission");
const { handleAgencyUnset } = require("./agencyUnset");
const { handleBatchAgencySubmission } = require("./batchAgencySubmission");
const { handleEntityByCidJob } = require("./entity");

async function doAvatarJobs() {
  doAvatarNonBatchJobs().then(() => console.log(`avatar non batch jobs finished`));
}

async function doEntityJobs() {
  const entityJobs = await getAvatarEntityJobs(10);
  const promises = entityJobs.map(job => handleEntityByCidJob(job));
  await Promise.all(promises);
}

async function doAvatarBatchJobs() {
  const batchJobs = await getAvatarBatchJobs(5);
  const promises = batchJobs.map(job => handleBatchAgencySubmission(job));
  await Promise.all(promises);
}

async function doAvatarNonBatchJobs() {
  const avatarNonBatchJobs = await getAvatarNonBatchJobs(10);
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
  doAvatarBatchJobs,
}
