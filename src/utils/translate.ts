import md5 from "md5";
import vscode from "vscode";
import { TranslateApp, translateAppKV } from "../constants/content";
import { obj2url } from "./obj2url";
import { generateYoudaoSignature, truncate } from "./youdao";

const thirdPartyUrl = {
  [TranslateApp.百度翻译]: "http://api.fanyi.baidu.com/api/trans/vip/translate",
  [TranslateApp.有道翻译]: "https://openapi.youdao.com/api",
};

// 处理待翻译文本，超过20字符只取前20

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
  const remoteUrl = thirdPartyUrl[app];
  const { currentContent, currentLang, targetLang, appid, appkey } = config;
  const salt = +new Date();
  const baiduSign = md5(`${appid}${currentContent}${salt}${appkey}`);
  const youdaoInput = truncate(currentContent);
  const {
    sign: youdaoSign,
    ts: curtime,
    salt: youdaoSalt,
  } = generateYoudaoSignature(appid, appkey, currentContent);
  let searchUrl = "";
  let searchData = {};

  switch (app) {
    case TranslateApp.百度翻译:
      searchData = {
        q: currentContent,
        from: getTranslateLan(currentLang),
        to: getTranslateLan(targetLang),
        appid,
        salt,
        sign: baiduSign,
      };
      searchUrl = obj2url(searchData);
      break;
    case TranslateApp.有道翻译:
      searchData = {
        q: youdaoInput,
        from: getTranslateLan(currentLang),
        to: getTranslateLan(targetLang),
        appKey: appid,
        salt: youdaoSalt,
        sign: youdaoSign,
        curtime,
        signType: "v3",
      };
      searchUrl = obj2url(searchData);
      break;
  }

  const translateUrl = `${remoteUrl}?${searchUrl}`;

  return {
    translateUrl,
    searchData,
  };
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

  const { translateUrl, searchData } = getTranslateUrl(app, {
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
      const youdaoData = await fetch(translateUrl, {
        method: "post",
        body: JSON.stringify(searchData),
      }).then((res) => res.json());

      return youdaoData?.translation?.[0] || `错误信息${youdaoData?.errorCode}`;
  }
};
