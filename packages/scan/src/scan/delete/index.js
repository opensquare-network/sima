async function deleteFrom(height) {
  if (!height) {
    throw new Error("No height given when deleting business");
  }
}

module.exports = {
  deleteFrom,
};
