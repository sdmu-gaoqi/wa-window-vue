const Prompt = require("inquirer");
const fs = require("fs");
const path = require("path");

const templatePath = path.resolve(__dirname, "./template");
const pagePath = path.resolve(__dirname, "../../src/views/project"); //指定要查询的目录

const questions = [
  {
    type: "input",
    name: "project",
    message: `页面名称(小驼峰英文)`,
  },
];

const main = async () => {
  const { project } = await Prompt.default.prompt(questions);
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
};

main();
