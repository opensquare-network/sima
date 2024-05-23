const {
  mongo: { ScanDb },
  env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;
let avatarCol = null;

async function initSimaScanDb() {
  db = new ScanDb(
    getEnvOrThrow("MONGO_SIMA_SCAN_URL"),
    getEnvOrThrow("MONGO_SIMA_SCAN_NAME"),
  );
  await db.init();

  avatarCol = await db.createCol("avatar");
  _createIndexes().then(() => console.log("DB indexes created!"));
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  // todo: add indexes
}

async function makeSureInit(col) {
  if (!col) {
    await initSimaScanDb();
  }
}

async function getSimaDb() {
  if (!db) {
    await initSimaScanDb();
  }

  return db;
}

module.exports = {
  initSimaScanDb,
  getSimaDb,
}
