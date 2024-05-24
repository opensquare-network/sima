const { isCid } = require("../../../../utils/ipfs/isCid");
const { sima: { getIpfsJobCol } } = require("@sima/mongo");
const { specSections, commands } = require("../../../../spec/consts");

async function insertIpfsJob(signer, command, args, indexer) {
  const maybeCid = args[0];
  if (!await isCid(maybeCid)) {
    return
  }

  const col = await getIpfsJobCol();
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
  insertIpfsJob,
}
