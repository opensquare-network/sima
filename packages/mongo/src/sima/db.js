const {
  mongo: { ScanDb },
  env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;
let avatarCol = null;
let avatarUnsetRecordCol = null;
let ipfsJobCol = null;

async function initSimaScanDb() {
  db = new ScanDb(
    getEnvOrThrow("MONGO_SIMA_SCAN_URL"),
    getEnvOrThrow("MONGO_SIMA_SCAN_NAME"),
  );
  await db.init();

  avatarCol = await db.createCol("avatar");
  avatarUnsetRecordCol = await db.createCol("avatarUnsetRecord");
  _createIndexes().then(() => console.log("DB indexes created!"));
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await ipfsJobCol.createIndex({ closed: 1 });
  await ipfsJobCol.createIndex({ section: 1, command: 1 });

  await avatarCol.createIndex({ address: 1 }, { unique: true });
  await avatarUnsetRecordCol.createIndex({ signer: 1 });
  await avatarUnsetRecordCol.createIndex({ signer: 1, "indexer.blockHeight": -1 });
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

async function getAvatarCol() {
  await makeSureInit(avatarCol);
  return avatarCol;
}

async function getIpfsJobCol() {
  await makeSureInit(ipfsJobCol);
  return ipfsJobCol;
}

async function getAvatarUnsetRecordCol() {
  await makeSureInit(avatarUnsetRecordCol);
  return avatarUnsetRecordCol;
}

module.exports = {
  initSimaScanDb,
  getSimaDb,
  getAvatarCol,
  getIpfsJobCol,
  getAvatarUnsetRecordCol,
}
