const { getAgencyJobCol } = require("./db");

async function markAgencyJobClosed(job) {
  const jobCol = await getAgencyJobCol(job);
  const { section, command, signer, indexer: { blockHeight, extrinsicIndex } } = job;
  await jobCol.updateOne({
    section, command, signer, "indexer.blockHeight": blockHeight, "indexer.extrinsicIndex": extrinsicIndex,
  }, { $set: { closed: true } });
}

module.exports = {
  markAgencyJobClosed,
}
