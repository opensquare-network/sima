const { fetch: { fetchJson } } = require("../../utils/ipfs");
const { avatar: { isAgencySubmissionFormatValid, isAgencyUnsetFormatValid } } = require("../../spec");
const {
  sima: { getAvatarCol, markEntityJobClosed, getAvatarUnsetRecordCol, getEntityJobCol }
} = require("@sima/mongo");
const { utils: { sleep } } = require("@osn/scan-common");

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

async function getAvatarEntityJobs(limit = 10) {
  const col = await getEntityJobCol();
  return await col.find({ closed: false }).sort({ "indexer.blockHeight": 1 }).limit(limit).toArray();
}

async function doEntityJobs() {
  while (true) {
    const entityJobs = await getAvatarEntityJobs(10);
    const promises = entityJobs.map(job => handleEntityByCidJob(job));
    await Promise.all(promises);

    await sleep(2 * 1000);
  }
}

module.exports = {
  doEntityJobs,
}
