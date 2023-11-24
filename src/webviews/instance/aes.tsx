import * as vscode from "vscode";
import { ChatWebview } from "..";
import { PostmessageType } from "../../constants/content";
import { aesDecrypt } from "../../utils/aes";

class AesWebview extends ChatWebview {
  constructor(context: vscode.ExtensionContext) {
    super({
      name: "wa-aes-decrypt",
      context,
      packName: "aes",
      receiveMessage: {
        [PostmessageType.解密]: async (e) => {
          const result = aesDecrypt(e.content, e.aesKey, {
            digit: e?.digit,
          });
          if (result) {
            this?.webview?.webview.postMessage({
              type: PostmessageType.解密完成,
              data: result,
            });
          } else {
            vscode.window.showErrorMessage("解密失败");
          }
        },
      },
    });
  }
}

export default AesWebview;
