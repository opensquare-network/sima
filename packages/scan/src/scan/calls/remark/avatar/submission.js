const { isCid } = require("../../../../utils/ipfs/isCid");
const { sima: { getAvatarCol } } = require("@sima/mongo");

async function handleSubmission(signer, args, indexer) {
  const maybeImgCid = args[0];
  if (!await isCid(maybeImgCid)) {
    return
  }

  const col = await getAvatarCol();
  await col.insertOne({
    address: signer,
    cid: maybeImgCid,
    mediaType: null,
    indexer,
  });
}

module.exports = {
  handleSubmission,
}
