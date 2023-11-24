import * as vscode from "vscode";
import SideMenusService, { Item } from "./waSideMenus";

class AesProvider extends SideMenusService {
  constructor(context: vscode.ExtensionContext) {
    super("wa-aes-decrypt", context);
  }
  getChildren(element: Item | undefined): vscode.ProviderResult<Item[]> {
    if (!element) {
      return Promise.resolve([]);
    }
  }
}

export default AesProvider;
