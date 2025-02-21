import md5 from "md5";
import vscode from "vscode";
import { TranslateApp, translateAppKV } from "../constants/content";
import { log } from "./log";

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
  const sign = md5(`${appid}${currentContent}${salt}${appkey}`);
  switch (app) {
    case TranslateApp.百度翻译:
      return `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${currentContent}&from=${getTranslateLan(
        currentLang
      )}&to=${getTranslateLan(
        targetLang
      )}&appid=${appid}&salt=${salt}&sign=${sign}`;
    case TranslateApp.有道翻译:
      return "http://dict.youdao.com/json/dictentry";
    case TranslateApp.谷歌翻译:
      return "https://translate.googleapis.com/translate_a/single";
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

  log(app);

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
      const salt = +new Date();
      const sign = md5(`${appid}${currentContent}${salt}${appkey}`);
      const url = `${translateUrl}?q=${currentContent}&from=${getTranslateLan(
        currentLang
      )}&to=${getTranslateLan(
        targetLang
      )}&appid=${appid}&salt=${salt}&sign=${sign}`;

      const data = await fetch(url).then((res) => res.json());

      return data?.trans_result?.[0]?.dst;
    case TranslateApp.有道翻译:
      break;
    case TranslateApp.谷歌翻译:
      break;
  }
};
