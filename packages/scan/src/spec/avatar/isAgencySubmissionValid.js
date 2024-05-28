const { isCid } = require("../../utils/ipfs/isCid");
const { isSignatureValid } = require("../../utils/crypto/signature");

async function isEntityValid(entity) {
  if (typeof entity !== 'object') {
    return false;
  }

  const { action, CID: imageCid, timestamp } = entity;
  if (!action || !imageCid || !timestamp) {
    return false;
  }
  if ("set-avatar" !== action) {
    return false;
  }
  if (!/^\d*$/.test(timestamp)) {
    return false;
  }
  return await isCid(imageCid);
}

async function isAgencySubmissionFormatValid(json) {
  if (typeof json !== 'object') {
    return false;
  }

  const { entity, address, signature } = json;
  if (!entity || !address || !signature) {
    return false;
  }

  if (!await isEntityValid(entity)) {
    return false;
  }

  return await isSignatureValid(JSON.stringify(entity), signature, address);
}

module.exports = {
  isAgencySubmissionFormatValid,
}
