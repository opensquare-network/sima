const {
  sima: { getIpfsJobCol },
} = require("@sima/mongo");
const { specSections } = require("../../spec/consts");
const { commands } = require("../../spec/consts/commands");

async function get10AvatarNonBatchJobs() {
  const col = await getIpfsJobCol();
  return await col.find({
    section: specSections.avatar,
    command: { $ne: commands.batchAgencySubmission },
    closed: false,
  }, { projection: { _id: 0 } })
    .sort({ "indexer.blockHeight": 1 })
    .limit(10)
    .toArray();
}

module.exports = {
  get10AvatarNonBatchJobs,
}
