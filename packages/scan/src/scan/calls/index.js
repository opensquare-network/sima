const {
  utils: { isExtrinsicSuccess, extractExtrinsicEvents },
  extrinsic: { handlePureNestedCalls },
} = require("@osn/scan-common");
const { handleRemark } = require("./remark");

async function handleCalls(call, author, extrinsicIndexer) {
  await handleRemark(call, author, extrinsicIndexer);
}

async function handleExtrinsics(extrinsics = [], allEvents = [], indexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);
    const extrinsicIndexer = { ...indexer, extrinsicIndex: index++ };
    if (!isExtrinsicSuccess(events)) {
      continue;
    }

    await handlePureNestedCalls(extrinsic, extrinsicIndexer, handleCalls);
  }
}

module.exports = {
  handleExtrinsics,
}
