import * as vscode from "vscode";
import { ChatWebview } from "..";
import { PostmessageType } from "../../constants/content";

class MemosWebview extends ChatWebview {
  constructor(context: vscode.ExtensionContext) {
    super({
      name: "wa-aes-decrypt",
      context,
      packName: "aes",
      receiveMessage: {
        [PostmessageType.解密]: async (e) => {},
      },
    });
  }
}

export default MemosWebview;
