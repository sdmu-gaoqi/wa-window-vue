import md5 from "md5";
import vscode from "vscode";
import { TranslateApp, translateAppKV } from "../constants/content";

const getTranslateUrl = (
  app: TranslateApp,
  config: {
    currentContent: string;
    currentLang: string;
    targetLang: string;
    appid: string;
    appkey: string;
  }
) => {
  const { currentContent, currentLang, targetLang, appid, appkey } = config;
  const salt = +new Date();
  const baiduSign = md5(`${appid}${currentContent}${salt}${appkey}`);
  const curtime = +new Date();
  const contentLength = currentContent.length;
  const youdaoInput =
    contentLength > 20
      ? `${currentContent.slice(0, 10)}${contentLength}${currentContent.slice(
          contentLength - 10
        )}`
      : currentContent;
  const youdaoSign = md5(`${appid}${currentContent}${salt}${curtime}${appkey}`);
  switch (app) {
    case TranslateApp.百度翻译:
      return `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${currentContent}&from=${getTranslateLan(
        currentLang
      )}&to=${getTranslateLan(
        targetLang
      )}&appid=${appid}&salt=${salt}&sign=${baiduSign}`;
    case TranslateApp.有道翻译:
      return `https://openapi.youdao.com/api?q=${youdaoInput}&from=${currentLang}&to=${targetLang}&appKey=${appkey}&salt=${salt}&sign=${youdaoSign}&signType=v3&curtime=${curtime}`;
  }
};

/**
 * @see https://zh.wikipedia.org/wiki/ISO_639-1https://zh.wikipedia.org/wiki/ISO_639-1
 */
export const getTranslateLan = (lan: string) => {
  const lanStr = lan.toLocaleLowerCase();
  switch (lanStr) {
    case "zh":
    case "zh-cn":
      return "zh";
    case "en":
    case "en-us":
      return "en";
    case "ja":
    case "ja-jp":
      return "jp";
    case "ko":
    case "kr":
    case "ko-kr":
      return "kor";
    case "zh-tw":
    case "zh-cnt":
    case "zh-cht":
      return "cht";
    default:
      return "en";
  }
};

export const translateServer = async ({
  currentContent,
  currentLang,
  targetLang,
  app,
}: {
  currentContent: string;
  currentLang: string;
  targetLang: string;
  app: TranslateApp;
}) => {
  if (!currentContent) {
    return "";
  }
  const config = vscode.workspace.getConfiguration();
  const appConfig = translateAppKV[app];
  const appid = String(config.get(appConfig.appid));
  const appkey = String(config.get(appConfig.key));

  if (!appid || !appkey) {
    return "请在vscode设置中配置插件对应的appid和key";
  }

  const translateUrl = getTranslateUrl(app, {
    currentContent,
    currentLang,
    targetLang,
    appid,
    appkey,
  });
  switch (app) {
    case TranslateApp.百度翻译:
      const baiduData = await fetch(translateUrl).then((res) => res.json());

      return (
        baiduData?.trans_result?.[0]?.dst || `错误信息${baiduData?.error_code}`
      );
    case TranslateApp.有道翻译:
      const youdaoData = await fetch(translateUrl).then((res) => res.json());

      return youdaoData?.translation?.[0] || `错误信息${youdaoData?.errorCode}`;
  }
};
