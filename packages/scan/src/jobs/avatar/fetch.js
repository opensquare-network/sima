const {
  sima: { getIpfsJobCol },
} = require("@sima/mongo");
const { specSections } = require("../../spec/consts");
const { commands } = require("../../spec/consts/commands");

async function getAvatarNonBatchJobs(limit = 10) {
  const col = await getIpfsJobCol();
  return await col.find({
    section: specSections.avatar,
    command: { $ne: commands.batchAgencySubmission },
    closed: false,
  }, { projection: { _id: 0 } })
    .sort({ "indexer.blockHeight": 1 })
    .limit(limit)
    .toArray();
}

async function getAvatarBatchJobs(limit = 5) {
  const col = await getIpfsJobCol();
  return await col.find({
    section: specSections.avatar,
    command: commands.batchAgencySubmission,
    closed: false,
  }, { projection: { _id: 0 } })
    .sort({ "indexer.blockHeight": 1 })
    .limit(limit)
    .toArray();
}

module.exports = {
  getAvatarNonBatchJobs,
  getAvatarBatchJobs,
}
