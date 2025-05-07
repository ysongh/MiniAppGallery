const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
  
module.exports = buildModule("MiniAppGalleryModule", (m) => {
  const miniAppGallery = m.contract("MiniAppGallery", []);

  return { miniAppGallery };
});