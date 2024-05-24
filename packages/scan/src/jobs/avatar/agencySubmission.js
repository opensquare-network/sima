const { avatar: { isAgencySubmissionFormatValid } } = require("../../spec");
const { fetch: { fetchJson, fetchMime } } = require("../../utils/ipfs");
const {
  sima: { getAvatarCol, markIpfsJobClosed }
} = require("@sima/mongo");

async function handleAgencySubmission(job) {
  const { cid, indexer, } = job;
  const json = await fetchJson(cid);
  if (!await isAgencySubmissionFormatValid(json)) {
    return;
  }

  const avatarCol = await getAvatarCol();
  const { address, entity: { CID: avatarCid } } = json;
  const avatarInDb = await avatarCol.findOne({ address });
  // this job handling maybe delayed after a new avatar setting, and we just ignore this job in this case.
  if (avatarInDb && avatarInDb.indexer?.blockHeight > job.indexer?.blockHeight) {
    await markIpfsJobClosed(job);
    return;
  }

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
