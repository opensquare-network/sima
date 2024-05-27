const { isSignatureValid } = require("../../utils/crypto/signature");

function isEntityValid(entity) {
  if (typeof entity !== 'object') {
    return false;
  }

  const { action, timestamp } = entity;
  if (!action || !timestamp) {
    return false;
  }
  return "unset-avatar" === action && /^\d*$/.test(timestamp);
}

async function isAgencyUnsetFormatValid(json) {
  if (typeof json !== 'object') {
    return false;
  }

  const { entity, address, signature } = json;
  if (!entity || !address || !signature) {
    return false;
  }

  if (!isEntityValid(entity)) {
    return false;
  }
  return await isSignatureValid(JSON.stringify(entity), signature, address);
}

module.exports = {
  isAgencyUnsetFormatValid,
};
