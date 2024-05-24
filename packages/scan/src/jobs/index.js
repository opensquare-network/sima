const { doAvatarJobs } = require("./avatar/jobs");

async function doJobs() {
  doAvatarJobs().then(() => console.log(`Avatar jobs finished`));
  // todo: 1. fetch jobs from database collection.
  // todo: 2. fetch img by CID and check media type. There should be IPFS fetching jobs here.
  // todo: 3. do operations
}

module.exports = {
  doJobs,
}
