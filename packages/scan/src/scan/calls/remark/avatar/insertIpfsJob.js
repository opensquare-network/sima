const { isCid } = require("../../../../utils/ipfs/isCid");
const { sima: { getIpfsJobCol } } = require("@sima/mongo");
const { specSections, commands } = require("../../../../spec/consts");

async function insertIpfsJob(signer, command, args, indexer) {
  const maybeImgCid = args[0];
  if (!await isCid(maybeImgCid)) {
    return
  }

  const col = await getIpfsJobCol();
  await col.insertOne({
    jobType: `${ specSections.avatar }_${ command }`,
    signer,
    cid: maybeImgCid,
    indexer,
    closed: false,
  });
}

module.exports = {
  insertIpfsJob,
}
