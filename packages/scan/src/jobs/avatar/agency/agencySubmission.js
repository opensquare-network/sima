const { avatar: { isAgencySubmissionFormatValid } } = require("../../../spec");
const { fetch: { fetchJson, fetchMime } } = require("../../../utils/ipfs");
const {
  sima: { getAvatarCol, markAgencyJobClosed }
} = require("@sima/mongo");
const { isAvatarJobDelay } = require("../common/checkAvatar");

async function handleAgencySubmission(job) {
  const { cid, indexer, } = job;
  const json = await fetchJson(cid);
  if (!await isAgencySubmissionFormatValid(json)) {
    await markAgencyJobClosed(job);
    return;
  }

  const { address, entity: { CID: avatarCid } } = json;
  if (await isAvatarJobDelay(address, job)) {
    await markAgencyJobClosed(job);
    return;
  }

  const avatarCol = await getAvatarCol();
  await avatarCol.updateOne({ address }, {
    $set: {
      cid: avatarCid,
      mediaType: null,
      timestamp: indexer.blockTime,
      indexer,
    }
  }, { upsert: true },);
  await markAgencyJobClosed(job);
}

module.exports = {
  handleAgencySubmission,
}
