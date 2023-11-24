import * as vscode from "vscode";
import { log } from "../utils/log";

export interface Item extends vscode.TreeItem {
  label: string;
  command?: vscode.Command;
}
class SideMenusService implements vscode.TreeDataProvider<Item> {
  treeView: vscode.TreeView<Item>;
  constructor(name: string, context: vscode.ExtensionContext) {
    this.treeView = vscode.window.createTreeView(name, {
      showCollapseAll: true,
      treeDataProvider: this,
    });
    context.subscriptions.push(this.treeView);
  }
  getChildren(element: Item | undefined): vscode.ProviderResult<Item[]> {
    return Promise.resolve([]);
  }
  getTreeItem(element: Item): vscode.TreeItem {
    return element;
  }
}

export default SideMenusService;
