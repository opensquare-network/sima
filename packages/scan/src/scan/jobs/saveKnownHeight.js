const {
  hasKnownHeightMark, clearKnownHeightMark,
} = require("../store");
const {
  knownHeight: { saveKnownHeights, getKnownHeightDb },
} = require("@sima/mongo");

async function saveKnownHeight(indexer) {
  const height = indexer.blockHeight;
  if (hasKnownHeightMark(height)) {
    await saveKnownHeights([height]);
  }

  const db = await getKnownHeightDb();
  await db.updateScanHeight(height);

  clearKnownHeightMark(height);
}

module.exports = {
  saveKnownHeight,
};
