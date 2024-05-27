require("dotenv").config();

const {
  chain: { getApi, setSpecHeights, subscribeFinalizedHeight },
} = require("@osn/scan-common");
const { handleBlock } = require("./scan/block");
const { sima: { initSimaScanDb } } = require("@sima/mongo");
const { doAvatarMediaTypePopulationJob } = require("./jobs/avatar/mediaType");

async function scanBlocks() {
  await initSimaScanDb();
  await subscribeFinalizedHeight();
  const blockHeights = [10625624];

  const api = await getApi();
  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);

    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await handleBlock({
      height,
      block: block.block,
      events: allEvents,
    });
    console.log(`${ height } finished`);
  }
}

(async () => {
  await doAvatarMediaTypePopulationJob();
  // await scanBlocks();

  console.log("finished");
  process.exit(0);
})();
