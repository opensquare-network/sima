const {
  signatureVerify,
  cryptoWaitReady,
} = require("@polkadot/util-crypto");

function signatureVerifySuccess(signedMessage, signature, address) {
  try {
    const result = signatureVerify(signedMessage, signature, address);
    return result.isValid;
  } catch (e) {
    return false;
  }
}

function wrapBytes(text) {
  return "<Bytes>" + text + "</Bytes>";
}

async function isSignatureValid(signedMessage, signature, address) {
  await cryptoWaitReady();
  return signatureVerifySuccess(signedMessage, signature, address) ||
    signatureVerifySuccess(wrapBytes(signedMessage), signature, address);
}

module.exports = {
  isSignatureValid,
}
