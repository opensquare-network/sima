const { getEntityJobCol } = require("./db");

async function insertEntityJob(job) {
  const col = await getEntityJobCol();
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

async function markEntityJobClosed(cid) {
  const col = await getEntityJobCol();
  await col.updateOne({ cid }, { $set: { closed: true } });
}

module.exports = {
  insertEntityJob,
  markEntityJobClosed,
}
