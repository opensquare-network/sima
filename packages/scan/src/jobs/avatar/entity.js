const { fetch: { fetchJson } } = require("../../utils/ipfs");
const { avatar: { isAgencySubmissionFormatValid, isAgencyUnsetFormatValid } } = require("../../spec");
const {
  sima: { getAvatarCol, markEntityJobClosed, getAvatarUnsetRecordCol }
} = require("@sima/mongo");

async function isAvatarSetDelay(address, timestamp) {
  const avatarCol = await getAvatarCol();
  const avatarInDb = await avatarCol.findOne({ address });
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

async function handleAgencySubmissionByEntity(jobCid, json = {}, indexer) {
  const { entity: { CID, timestamp }, address } = json;
  if (await isAvatarSetDelay(address, timestamp)) {
    await markEntityJobClosed(jobCid);
    return;
  }

  const avatarCol = await getAvatarCol();
  await avatarCol.updateOne({ address }, {
    $set: {
      cid: CID,
      mediaType: null,
      timestamp: indexer.blockTime,
      indexer,
    }
  }, { upsert: true },);
  await markEntityJobClosed(jobCid);
}

async function handleAgencyUnsetByEntity(jobCid, json = {}, indexer) {
  const { entity: { timestamp }, address } = json;
  if (await isAvatarSetDelay(address, timestamp)) {
    await markEntityJobClosed(jobCid);
    return;
  }

  const avatarCol = await getAvatarCol();
  await avatarCol.deleteOne({ address });

  const unsetCol = await getAvatarUnsetRecordCol();
  await unsetCol.insertOne({ address, timestamp, indexer });
  await markEntityJobClosed(jobCid);
}

async function handleEntityByCidJob(job = {}) {
  const { cid, indexer } = job;

  const json = await fetchJson(cid);
  if (await isAgencySubmissionFormatValid(json)) {
    await handleAgencySubmissionByEntity(cid, json, indexer);
  } else if (await isAgencyUnsetFormatValid(json)) {
    await handleAgencyUnsetByEntity(cid, json, indexer);
  }
}

module.exports = {
  handleEntityByCidJob,
}
