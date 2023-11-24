import * as vscode from "vscode";
import { ChatWebview } from "..";

class Json2TsWebview extends ChatWebview {
  constructor(context: vscode.ExtensionContext) {
    super({
      name: "wa-json2ts",
      context,
      packName: "json2ts",
      receiveMessage: {},
    });
  }
}

export default Json2TsWebview;
