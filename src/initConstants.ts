import * as vscode from "vscode";

export const defaultCsvPath = "src/locales/locales.csv";
export const defaultCsvTransformPath = "src/locales";
export const defaultCsvTransformLanauges = [
  "zh-CN",
  "zh-TW",
  "en-US",
  "ja-JP",
  "ko-KR",
];
export const defaultLang = "zh-CN";

/**
 * @description 获取vscode 插件配置 没有就用默认的
 * */
export const getInitConstants = () => {
  const _csvPath =
    vscode.workspace.getConfiguration().get("csvPath") || defaultCsvPath;
  const _csvTransformPath =
    vscode.workspace.getConfiguration().get("csvTransformPath") ||
    defaultCsvTransformPath;
  const _csvTransformLanauges =
    vscode.workspace.getConfiguration().get("csvTransformLanauges") ||
    defaultCsvTransformLanauges;
  const _csvDefaultLan =
    vscode.workspace.getConfiguration().get("csvDefaultLan") || defaultLang;

  return {
    csvPath: _csvPath as string,
    csvTransformPath: _csvTransformPath as string,
    lanauges: _csvTransformLanauges as string[],
    defaultLang,
  };
};
