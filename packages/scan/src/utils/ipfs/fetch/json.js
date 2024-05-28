const axios = require("axios");
const { getEndpoints } = require("./endpoints");

async function fetchJson(cid) {
  const endpoints = getEndpoints();
  const promises = [];
  for (const endpoint of endpoints) {
    const promise = axios
      .get(`${ endpoint }${ cid }`, {
        timeout: 180 * 1000, // max 3 mins for fetching json data
      })
      .then((res) => res.data);
    promises.push(promise);
  }

  return Promise.any(promises);
}

module.exports = {
  fetchJson,
};
