import * as vscode from "vscode";
import SideMenusService, { Item } from "./waSideMenus";

class TranslateProvider extends SideMenusService {
  constructor(context: vscode.ExtensionContext) {
    super("wa-translate", context);
  }
  getChildren(element: Item | undefined): vscode.ProviderResult<Item[]> {
    if (!element) {
      return Promise.resolve([
        {
          label: "内容",
          description: `请输入需要翻译的文字`,
          type: "select",
        },
      ]);
    }
  }
}

export default TranslateProvider;
