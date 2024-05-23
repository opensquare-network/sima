require("dotenv").config();

const {
  sima: { initSimaScanDb },
  knownHeight: { initKnownHeightDb },
} = require("@sima/mongo");
const {
  chain: { subscribeFinalizedHeight, updateSpecs, checkSpecs },
  env: { isUseMetaDb },
} = require("@osn/scan-common");
const { scan } = require("./scan");

(async () => {
  await initSimaScanDb();
  await initKnownHeightDb();
  await subscribeFinalizedHeight();

  if (isUseMetaDb()) {
    await updateSpecs();
    checkSpecs();
  }

  await scan();
})();
