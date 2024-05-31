const { doEntityJobs } = require("./avatar/entity");
const { doAgencyJobs } = require("./avatar/agency");
const { doAvatarMediaTypePopulationJob } = require("./avatar/mediaType");

async function doJobs() {
  doAgencyJobs().then(() => console.log(`Avatar agency jobs done`));
  doEntityJobs().then(() => console.log(`Avatar entity jobs done`));
  doAvatarMediaTypePopulationJob().then(() => console.log(`Avatar media types done`));
}

module.exports = {
  doJobs,
}
