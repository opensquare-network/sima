const {
  mongo: { ScanDb },
  env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;
let avatarCol = null;
let avatarUnsetRecordCol = null;
let agencyJobCol = null;
let entityJobCol = null;

async function initSimaScanDb() {
  db = new ScanDb(
    getEnvOrThrow("MONGO_SIMA_SCAN_URL"),
    getEnvOrThrow("MONGO_SIMA_SCAN_NAME"),
  );
  await db.init();

  avatarCol = await db.createCol("avatar");
  avatarUnsetRecordCol = await db.createCol("avatarUnsetRecord");
  agencyJobCol = await db.createCol("ipfsJob");
  entityJobCol = await db.createCol("entityJob");
  _createIndexes().then(() => console.log("DB indexes created!"));
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await agencyJobCol.createIndex({ closed: 1 });
  await agencyJobCol.createIndex({ section: 1, command: 1 });

  await avatarCol.createIndex({ address: 1 }, { unique: true });
  await avatarUnsetRecordCol.createIndex({ signer: 1 });
  await avatarUnsetRecordCol.createIndex({ signer: 1, "indexer.blockHeight": -1 });

  await entityJobCol.createIndex({ cid: 1 });
  await entityJobCol.createIndex({ closed: 1 });
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

async function getAgencyJobCol() {
  await makeSureInit(agencyJobCol);
  return agencyJobCol;
}

async function getAvatarUnsetRecordCol() {
  await makeSureInit(avatarUnsetRecordCol);
  return avatarUnsetRecordCol;
}

async function getEntityJobCol() {
  await makeSureInit(entityJobCol);
  return entityJobCol;
}

module.exports = {
  initSimaScanDb,
  getSimaDb,
  getAvatarCol,
  getAgencyJobCol,
  getAvatarUnsetRecordCol,
  getEntityJobCol,
}
