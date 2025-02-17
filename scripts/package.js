const fs = require("fs");
const packagePath = "./package.json";

const getPackageInfo = async () => {
  const fileContent = await fs.readFileSync(packagePath);
  return JSON.parse(fileContent);
};

const writePackage = (jsonData) => {
  fs.writeFileSync(packagePath, JSON.stringify(jsonData, null, "  ") + "\n");
};

module.exports = {
  getPackageInfo,
  writePackage,
};
