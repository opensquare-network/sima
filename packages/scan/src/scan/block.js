const {
  chain: { getBlockIndexer },
} = require("@osn/scan-common");
const { handleExtrinsics } = require("./calls");
const { doJobsAfterBlock } = require("./jobs");

async function handleBlock({ block, events }) {
  const blockIndexer = getBlockIndexer(block);
  await handleExtrinsics(block.extrinsics, events, blockIndexer);

  await doJobsAfterBlock(blockIndexer);
}

module.exports = {
  handleBlock,
};
