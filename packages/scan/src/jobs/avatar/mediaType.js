const {
  sima: { getAvatarCol, updateAvatar },
} = require("@sima/mongo");
const { utils: { sleep } } = require("@osn/scan-common");
const { isCid } = require("../../utils/ipfs");
const { fetch: { fetchMime } } = require("../../utils/ipfs");

async function get10NullMediaTypeAvatar() {
  const col = await getAvatarCol();
  return await col.find({ mediaType: null }, { projection: { _id: 0 } })
    .sort({ "indexer.blockHeight": 1 })
    .limit(10)
    .toArray();
}

async function handleOneAvatarMediaJob(avatarRecord = {}) {
  const { address, cid } = avatarRecord;
  if (!await isCid(cid)) {
    // todo: handle this exception. May mark this record as invalid.
    return;
  }

  const { type } = await fetchMime(cid); // todo: handle mime fetch failure
  await updateAvatar(address, { mediaType: type });
}

async function onetimeJob() {
  const avatarRecords = await get10NullMediaTypeAvatar();
  const promises = avatarRecords.map(record => handleOneAvatarMediaJob(record));
  await Promise.all(promises);

  return avatarRecords.length;
}

async function doAvatarMediaTypePopulationJob() {
  while (true) {
    const handledJobsLen = await onetimeJob();
    await sleep(handledJobsLen <= 0 ? 10000 : 1000); // sleep 10 secs if previously no jobs
  }
}

module.exports = {
  doAvatarMediaTypePopulationJob,
}
