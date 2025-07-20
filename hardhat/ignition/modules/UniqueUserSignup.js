const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
  
module.exports = buildModule("UniqueUserSignupModule", (m) => {
  const uniqueUserSignup = m.contract("UniqueUserSignup", ["0x68c931C9a534D37aa78094877F46fE46a49F1A51", 1]);

  return { uniqueUserSignup };
});