const { isCid } = require("../../../../utils/ipfs/isCid");
const { sima: { getAgencyJobCol } } = require("@sima/mongo");
const { specSections, commands } = require("../../../../spec/consts");

async function insertAgencyJob(signer, command, args, indexer) {
  const maybeCid = args[0];
  if (!await isCid(maybeCid)) {
    return
  }

  const col = await getAgencyJobCol();
  await col.insertOne({
    section: specSections.avatar,
    command: command,
    signer,
    cid: maybeCid,
    indexer,
    closed: false,
  });
}

module.exports = {
  insertAgencyJob,
}
