import fs from "fs";
import path from "path";
import vscode from "vscode";
import { PostmessageType } from "../constants/content";
import bridge from "../utils/bridge";

type ChatWebviewConfig = {
  name: string;
  context: vscode.ExtensionContext;
  packName: string;
  receiveMessage?: Partial<typeof bridge>;
};

export class ChatWebview implements vscode.WebviewViewProvider {
  public webview: vscode.WebviewView | null = null;
  tsx: (webview: vscode.WebviewView) => void = () => {};
  isProduction: boolean = false;
  config: ChatWebviewConfig;
  context?: vscode.ExtensionContext = undefined;

  constructor(c: ChatWebviewConfig) {
    const { context } = c;
    this.config = c;
    this.isProduction =
      context.extensionMode === vscode.ExtensionMode.Production;
    this.context = context;
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    const { receiveMessage, packName, context } = this.config;
    this.webview = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
    };
    // 监听web端传来的消息
    this.webview.webview.onDidReceiveMessage((message: any) => {
      const fn = receiveMessage?.[message.type as PostmessageType];
      if (fn) {
        fn(message.data);
      }
    });

    const vsFilePath = vscode.Uri.file(
      path.join(context.extensionPath, "dist")
    );
    const distPath = webviewView.webview.asWebviewUri(vsFilePath).toString();
    this.getWebviewContent(packName, distPath).then((res) => {
      webviewView.webview.html = res;
    });
  }

  async getWebviewContent(packName: string, distPath: string) {
    const filePath = path.resolve(__dirname, `${packName}/index.html`);
    // 打包出来的引入资源是<script type="module" crossorigin src="/js/aes-BhdnNi2k.js"></script> 这种, 需要替换下
    let content = await fs.readFileSync(filePath, "utf-8");
    content = content.replaceAll('src="', `src="${distPath}`);
    content = content.replaceAll('href="', `href="${distPath}`);
    return content;
  }

  getStorage(key: string, type: "global" | "workspace" = "workspace") {
    const fn =
      type === "global"
        ? this.context?.globalState
        : this.context?.workspaceState;
    return fn?.get(key);
  }

  setStorage(
    key: string,
    value: unknown,
    type: "global" | "workspace" = "workspace"
  ) {
    const fn =
      type === "global"
        ? this.context?.globalState
        : this.context?.workspaceState;
    fn?.update(key, value);
  }
}
