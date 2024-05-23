const { saveKnownHeight } = require("./saveKnownHeight");
const { sima: { getSimaDb } } = require("@sima/mongo");

async function doJobsAfterBlock(indexer) {
  const db = await getSimaDb();
  await db.updateScanHeight(indexer.blockHeight);

  await saveKnownHeight(indexer);
}

module.exports = {
  doJobsAfterBlock,
};
