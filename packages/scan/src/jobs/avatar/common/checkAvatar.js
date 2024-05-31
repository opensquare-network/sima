const {
  sima: { getAvatarCol, getAvatarUnsetRecordCol, }
} = require("@sima/mongo");

async function isAvatarJobDelay(address, timestamp) {
  const avatarCol = await getAvatarCol();
  const avatarInDb = await avatarCol.findOne({ address });
  // this job handling maybe delayed after a new avatar setting, and we just ignore this job in this case.
  if (avatarInDb && avatarInDb.timestamp > timestamp) {
    return true;
  }

  const unsetCol = await getAvatarUnsetRecordCol();
  const items = await unsetCol.find({ address }).sort({ "indexer.blockHeight": -1 }).limit(1).toArray();
  if (items.length <= 0) {
    return false;
  }
  const latestUnsetRecord = items[0];
  return latestUnsetRecord.timestamp > timestamp;
}

module.exports = {
  isAvatarJobDelay,
}
