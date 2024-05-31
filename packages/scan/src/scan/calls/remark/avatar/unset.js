const {
  sima: {
    getAvatarCol,
    getAvatarUnsetRecordCol,
  }
} = require("@sima/mongo");

async function handleAvatarUnset(signer, indexer) {
  const avatarCol = await getAvatarCol();
  await avatarCol.deleteOne({ address: signer });

  const unsetCol = await getAvatarUnsetRecordCol();
  await unsetCol.insertOne({
    address: signer,
    timestamp: indexer.blockTime,
    indexer,
  });
}

module.exports = {
  handleAvatarUnset,
}
