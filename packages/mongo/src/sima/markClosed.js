const { getIpfsJobCol } = require("./db");

async function markIpfsJobClosed(job) {
  const jobCol = await getIpfsJobCol(job);
  const { section, command, signer, indexer: { blockHeight, extrinsicIndex } } = job;
  await jobCol.updateOne({
    section, command, signer, "indexer.blockHeight": blockHeight, "indexer.extrinsicIndex": extrinsicIndex,
  }, { $set: { closed: true } });
}

module.exports = {
  markIpfsJobClosed,
}
