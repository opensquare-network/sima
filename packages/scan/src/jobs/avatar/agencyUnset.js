const { fetch: { fetchJson } } = require("../../utils/ipfs");
const { avatar: { isAgencyUnsetFormatValid } } = require("../../spec");
const {
  sima: { getAvatarCol, markIpfsJobClosed, getAvatarUnsetRecordCol, }
} = require("@sima/mongo");
const { isAvatarJobDelay } = require("./common/checkAvatar");

async function handleAgencyUnset({ job }) {
  const { cid, indexer, } = job;
  const json = await fetchJson(cid);
  if (!await isAgencyUnsetFormatValid(json)) {
    await markIpfsJobClosed(job);
    return;
  }

  const { address } = json;
  if (await isAvatarJobDelay(address, job)) {
    await markIpfsJobClosed(job);
    return;
  }

  const avatarCol = await getAvatarCol();
  await avatarCol.deleteOne({ address });

  const unsetCol = await getAvatarUnsetRecordCol();
  await unsetCol.insertOne({ address, indexer });
}

module.exports = {
  handleAgencyUnset,
}
