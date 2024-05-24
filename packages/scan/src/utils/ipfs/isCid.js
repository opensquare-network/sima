async function isCid(str) {
  const { CID } = await import("multiformats");
  try {
    CID.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  isCid
};
