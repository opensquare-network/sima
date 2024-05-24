const {
  sima: {
    getAvatarCol,
    getAvatarUnsetRecordCol,
  }
} = require("@sima/mongo");

async function handleAvatarUnset(signer, indexer) {
  const avatarCol = await getAvatarCol();
  await avatarCol.deleteOne({ signer });

  const unsetCol = await getAvatarUnsetRecordCol();
  await unsetCol.insertOne({
    signer,
    indexer,
  });
}

module.exports = {
  handleAvatarUnset,
}
