import * as vscode from "vscode";

export const isCsv = (dom: vscode.TextDocument) => {
  // document.languageId
  return dom && dom?.fileName.includes(".csv");
};
