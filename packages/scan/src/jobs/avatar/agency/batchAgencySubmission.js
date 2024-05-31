const { fetch: { fetchJson }, isCid } = require("../../../utils/ipfs");
const {
  sima: { markAgencyJobClosed, insertEntityJob }
} = require("@sima/mongo");

async function handleBatchAgencySubmission(job) {
  const { cid, indexer } = job;
  const json = await fetchJson(cid);
  if (!Array.isArray(json)) {
    await markAgencyJobClosed(job);
    return;
  }

  for (const cid of json) {
    if (!await isCid(cid)) {
      continue;
    }
    await insertEntityJob({ cid, indexer });
  }

  await markAgencyJobClosed(job);
}

module.exports = {
  handleBatchAgencySubmission,
}
