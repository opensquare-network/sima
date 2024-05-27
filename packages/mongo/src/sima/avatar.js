const isEmpty = require("lodash.isempty");
const { getAvatarCol } = require("./db");

async function updateAvatar(address, updates = {}) {
  if (isEmpty(updates)) {
    return;
  }

  const col = await getAvatarCol();
  await col.updateOne({ address }, { $set: updates });
}

module.exports = {
  updateAvatar,
}
