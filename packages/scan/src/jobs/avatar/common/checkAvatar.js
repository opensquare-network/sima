const {
  sima: { getAvatarCol, getAvatarUnsetRecordCol, }
} = require("@sima/mongo");

async function isAvatarJobDelay(address, job) {
  const avatarCol = await getAvatarCol();
  const avatarInDb = await avatarCol.findOne({ address });
  // this job handling maybe delayed after a new avatar setting, and we just ignore this job in this case.
  if (avatarInDb && avatarInDb.timestamp > job.indexer?.blockTime) {
    return true;
  }

  const unsetCol = await getAvatarUnsetRecordCol();
  const items = await unsetCol.find({ address }).sort({ "indexer.blockHeight": -1 }).limit(1).toArray();
  if (items.length <= 0) {
    return false;
  }
  const latestUnsetRecord = items[0];
  return latestUnsetRecord.timestamp > job.indexer?.blockTime;
}

module.exports = {
  isAvatarJobDelay,
}
