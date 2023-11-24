import { PostmessageType } from "../constants/content";

const bridge = {
  // vscode listen webview
  [PostmessageType.翻译完成]: (callback: (data: string) => void) => {
    window.addEventListener("message", (e) => {
      const data = e?.data;
      if (data.type === PostmessageType.翻译完成) {
        callback(data?.data);
      }
    });
  },
  // webview to vscode
  [PostmessageType.翻译]: (state: {
    currentContent: string;
    currentLang: string;
    targetLang: string;
  }) => {
    window.vscode.postMessage({
      type: PostmessageType.翻译,
      data: {
        currentContent: state.currentContent,
        currentLang: state.currentLang,
        targetLang: state.targetLang,
      },
    });
  },
  [PostmessageType.解密]: (state: {
    content: string;
    aesKey: string;
    digit: number;
  }) => {
    window.vscode.postMessage({
      type: PostmessageType.解密,
      data: {
        content: state.content,
        aesKey: state.aesKey,
      },
    });
  },
  [PostmessageType.解密完成]: (callback: (data: string) => void) => {
    window.addEventListener("message", (e) => {
      const data = e?.data;
      if (data.type === PostmessageType.解密完成) {
        callback(data?.data);
      }
    });
  },
};

export default bridge;
