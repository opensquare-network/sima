const { getAvatarNonBatchJobs, getAvatarBatchJobs } = require("./fetch");
const { commands } = require("../../../spec/consts/commands");
const { handleAgencySubmission } = require("./agencySubmission");
const { handleAgencyUnset } = require("./agencyUnset");
const { utils: { sleep } } = require("@osn/scan-common");
const { handleBatchAgencySubmission } = require("./batchAgencySubmission");

async function doAgencyJobs() {
  doAvatarNonBatchJobs().then(() => console.log(`avatar non batch jobs finished`));
  doAvatarBatchJobs().then(() => console.log(`avatar batch jobs finished finished`));
}

async function doAvatarBatchJobs() {
  while (true) {
    const batchJobs = await getAvatarBatchJobs(5);
    const promises = batchJobs.map(handleBatchAgencySubmission);
    await Promise.all(promises);

    await sleep(10 * 1000);
  }
}

async function doAvatarNonBatchJobs() {
  while (true) {
    const avatarNonBatchJobs = await getAvatarNonBatchJobs(10);
    const promises = avatarNonBatchJobs.map(handleOneAvatarJob);
    await Promise.all(promises);

    await sleep(10 * 1000);
  }
}

async function handleOneAvatarJob(job) {
  if (commands.agencySubmission === job.command) {
    await handleAgencySubmission(job);
  } else if (commands.agencyUnset === job.command) {
    await handleAgencyUnset(job);
  }
}

module.exports = {
  doAgencyJobs,
}
