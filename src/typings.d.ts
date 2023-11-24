export * from "./types/auto-import";
export * from "./types/components";
export {};

declare module "*.module.css";
declare module "*.module.scss";
declare module "*.svg";
declare module "*.png";

declare global {
  interface Window {
    vscode: {
      postMessage: (message: any) => void;
      onDidReceiveMessage: (message: any) => void;
    };
    $webview: {
      baiduAppid: string;
      baiduAppKey: string;
    };
  }
}
