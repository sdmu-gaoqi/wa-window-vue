const Prompt = require("inquirer");
const fs = require("fs");
const path = require("path");
const { getPackageInfo, writePackage } = require("../package");

const templatePath = path.resolve(__dirname, "./template");
const pagePath = path.resolve(__dirname, "../../src/views/project"); //指定要查询的目录

const webviewKey = "webview";
const notWebviewKey = "非webview";
const typeOptions = [webviewKey, notWebviewKey];

const questions = [
  {
    type: "input",
    name: "project",
    message: `页面名称(小驼峰英文)`,
  },
  {
    type: "list",
    choices: typeOptions,
    name: "type",
    message: "创建类型",
  },
];

const webviewQuestions = [
  {
    type: "input",
    name: "name",
    message: `描述信息`,
  },
];

const createWebview = async (project) => {
  const folderPath = `${pagePath}/${project}`;
  const existenced = await fs.existsSync(folderPath);
  if (existenced) {
    return console.log(`${project}已存在`);
  }
  await fs.mkdirSync(folderPath);
  fs.cp(templatePath, folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });
  const packageInfo = await getPackageInfo();
  const { name } = await Prompt.default.prompt(webviewQuestions);
  packageInfo.contributes.views["wa-sideMenus-vue"].push({
    type: "webview",
    id: `wa-${project}`,
    name,
  });
  writePackage(packageInfo);
};

const main = async () => {
  const { project, type } = await Prompt.default.prompt(questions);
  switch (type) {
    case webviewKey:
      await createWebview(project);
      return;
    case notWebviewKey:
      return;
    default:
      return;
  }
};

main();
