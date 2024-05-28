const { isSignatureValid } = require("./signature");

test("signature verify function works", async () => {
  const entity = {
    "action": "set-avatar",
    "CID": "bafybeibcruwoc7aagctjem3xzmskc7pbbhfhavst4dexvmw6tr6gtq4fy4",
    "timestamp": 1716275915587
  }
  const msg = JSON.stringify(entity);
  const address = "15ifSDJD2wA7XWwDsitFCHu3wsEfkeBESSxkQg3q8sHqAF2R";
  const signature = "0x1c0e28b6cd9826a6bbd6296cf0aa251998fa92eed32d159959d8acbe4bc48c126191e4a64a3a848422a2894fc1f6855a695e84065c1e4bc95debd5193f61b685";

  expect(await isSignatureValid(msg, signature, address)).toBe(true);
});
