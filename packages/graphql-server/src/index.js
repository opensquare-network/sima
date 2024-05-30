require("dotenv").config();

const { createYoga } = require("graphql-yoga");
const { createServer } = require("http");
const { sima: { initSimaScanDb } } = require("@sima/mongo");
const { schema } = require("./schema");

const port = parseInt(process.env.PORT) || 8100;

function main() {
  initSimaScanDb().then(() => console.log("DB initialized"));
  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });
}

main();
