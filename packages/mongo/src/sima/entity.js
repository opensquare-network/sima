const { getEntityJobCol } = require("./db");

async function insertEntityJob(job) {
  const col = await getEntityJobCol(job);
  const { cid, indexer } = job;
  const maybeInDb = await col.findOne({ cid });
  if (maybeInDb) {
    return;
  }

  await col.insertOne({
    cid,
    indexer,
    closed: false,
  });
}

module.exports = {
  insertEntityJob,
}
