import * as vscode from "vscode";
import { ChatWebview } from "..";
import { PostmessageType } from "../../constants/content";
import { translateServer } from "../../utils/translate";

class TranslateWebview extends ChatWebview {
  constructor(context: vscode.ExtensionContext) {
    super({
      name: "wa-translate",
      context,
      packName: "translate",
      receiveMessage: {
        [PostmessageType.翻译]: async (e) => {
          const res = await translateServer(e);
          this?.webview?.webview.postMessage({
            type: PostmessageType.翻译完成,
            data: res,
          });
        },
      },
    });
  }
}

export default TranslateWebview;
