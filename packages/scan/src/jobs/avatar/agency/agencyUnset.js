const { fetch: { fetchJson } } = require("../../../utils/ipfs");
const { avatar: { isAgencyUnsetFormatValid } } = require("../../../spec");
const {
  sima: { getAvatarCol, markAgencyJobClosed, getAvatarUnsetRecordCol, }
} = require("@sima/mongo");
const { isAvatarJobDelay } = require("../common/checkAvatar");

async function handleAgencyUnset({ job }) {
  const { cid, indexer, } = job;
  const json = await fetchJson(cid);
  if (!await isAgencyUnsetFormatValid(json)) {
    await markAgencyJobClosed(job);
    return;
  }

  const { address } = json;
  if (await isAvatarJobDelay(address, job)) {
    await markAgencyJobClosed(job);
    return;
  }

  const avatarCol = await getAvatarCol();
  await avatarCol.deleteOne({ address });

  const unsetCol = await getAvatarUnsetRecordCol();
  await unsetCol.insertOne({ address, indexer });
  await markAgencyJobClosed(job);
}

module.exports = {
  handleAgencyUnset,
}
