const { SimaSpecParser, specSections } = require("../../../spec");
const { setKnownHeightMark } = require("../../store");
const { handleAvatarCommand } = require("./avatar");

async function handleRemark(call, signer, extrinsicIndexer) {
  const { section, method } = call;
  if ("system" !== section || !["remark", "remarkWithEvent"].includes(method)) {
    return;
  }

  const text = call.args[0].toHuman();
  const parser = new SimaSpecParser(text);
  if (!parser.isValid) {
    return;
  }

  if (specSections.avatar === parser.section) {
    await handleAvatarCommand(signer, parser.command, parser.args, extrinsicIndexer);
  } else if (specSections.delegation === parser.section) {
    // todo: handle spec delegation business
  }

  setKnownHeightMark(extrinsicIndexer.blockHeight);
}

module.exports = {
  handleRemark,
}
