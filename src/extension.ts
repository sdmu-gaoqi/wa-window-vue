import * as vscode from "vscode";
import { getInitConstants } from "./initConstants";
import log from "./log";
import { isCsv } from "./utils";
import * as fs from "fs";

const quitEnter = (document: vscode.TextDocument) => {
  const { csvPath } = getInitConstants();
  if (!isCsv(document)) {
    return false;
  }

  // 如果保存的文件不是csv的配置文件 终止执行
  // 当前活跃的地址
  const activePath =
    vscode.workspace.getWorkspaceFolder(document.uri)?.uri.path + csvPath;
  if (activePath !== document.uri.path) {
    return false;
  }
  return true;
};

const csvTransformLanauges = async (document: vscode.TextDocument) => {
  try {
    const { csvPath, csvTransformPath, lanauges, defaultLang } =
      getInitConstants();
    const csvContent = document.getText();
    const csvLines = csvContent.split(/\r?\n/);
    // 默认第一二行是备注标题 不纳入到内容里
    const csvHeader = csvLines[0];
    const csvBodys = csvLines.slice(3);

    const langContenes = lanauges.map((lan) => {
      return {
        name: `${lan}.ts`,
        content: {},
      };
    });

    csvBodys.forEach((line) => {
      let lineContent = line.split(",");
      const lineKey = lineContent[0];
      lineContent = lineContent.slice(1);
      const defaultIndex =
        lanauges.findIndex((item) => item === defaultLang) || 1;
      lineContent.forEach((lineSpan, lineSpanIndex) => {
        const lineSpanContent = lineSpan || lineContent[defaultIndex];
        // @ts-ignore
        langContenes[lineSpanIndex].content[lineKey] = lineSpanContent;
      });
    });
    // 当前活跃的文件夹
    const activeWork = vscode.workspace.getWorkspaceFolder(document.uri)?.uri
      .path;

    const path = `${activeWork}${csvTransformPath}`;

    // 写入文件事件
    const writeFile = () => {
      langContenes.forEach(async ({ name, content }, index) => {
        const buffer = Buffer.from(
          `export default ${JSON.stringify(content, null, 2)}\n`
        );
        // 不使用vscode.workspace.fs 不能保证具有文件的操作权限
        // 写入文件
        const filePath = `${path}/${name}`;
        fs.writeFileSync(filePath, buffer);
        if (index === langContenes.length - 1) {
          vscode.window.showInformationMessage("自动转换完成");
        }
      });
    };

    // 判断path路径是否已创建
    if (!fs.existsSync(path)) {
      vscode.window.showWarningMessage("目录不存在,自动创建目录");
      fs.mkdir(path, (err) => {
        if (err) {
          vscode.window.showInformationMessage("目录创建失败");
          return;
        }

        // 目录创建成功
        writeFile();
      });
    } else {
      writeFile();
    }

    // 这里配置本地的
  } catch (err) {
    const errContent = JSON.stringify(err);
    vscode.window.showErrorMessage("转换出错");
    log(errContent);
  }
};
export async function activate(context: vscode.ExtensionContext) {
  const project = vscode.workspace.onDidSaveTextDocument(
    (document: vscode.TextDocument) => {
      if (!quitEnter(document)) {
        return;
      }
      // 在这里编写在保存文件时要执行的操作
      csvTransformLanauges(document);
    }
  );
  context.subscriptions.push(project);
}

// This method is called when your extension is deactivated
export function deactivate() {}
