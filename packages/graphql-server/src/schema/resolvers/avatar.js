const { sima: { getAvatarCol } } = require("@sima/mongo");

async function avatar(_, _args) {
  const { address } = _args;

  const col = await getAvatarCol();
  return await col.findOne({ address }, { projection: { _id: 0 } });
}

module.exports = {
  avatar,
}
