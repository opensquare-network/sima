const { avatar: { isAgencySubmissionFormatValid } } = require("../../spec");
const { fetch: { fetchJson, fetchMime } } = require("../../utils/ipfs");
const {
  sima: { getAvatarCol, markIpfsJobClosed }
} = require("@sima/mongo");
const { isAvatarJobDelay } = require("./common/checkAvatar");

async function handleAgencySubmission(job) {
  const { cid, indexer, } = job;
  const json = await fetchJson(cid);
  if (!await isAgencySubmissionFormatValid(json)) {
    await markIpfsJobClosed(job);
    return;
  }

  const { address, entity: { CID: avatarCid } } = json;
  if (await isAvatarJobDelay(address, job)) {
    await markIpfsJobClosed(job);
    return;
  }

  const avatarCol = await getAvatarCol();
  const { type } = await fetchMime(avatarCid);
  await avatarCol.updateOne(
    { address },
    { $set: { cid: avatarCid, mediaType: type, indexer } },
    { upsert: true },
  );
  await markIpfsJobClosed(job);
}

module.exports = {
  handleAgencySubmission,
}
