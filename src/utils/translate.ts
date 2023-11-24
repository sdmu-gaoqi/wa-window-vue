import md5 from "md5";
import fetch from "cross-fetch";
import { log } from "./log";
import * as vscode from "vscode";

// 获取百度api翻译语言
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
}: {
  currentContent: string;
  currentLang: string;
  targetLang: string;
}) => {
  if (!currentContent) {
    return "";
  }
  const config = vscode.workspace.getConfiguration();
  const baiduAppid = config.get("windowBaiduAppid");
  const baiduKey = config.get("windowBaiduKey");
  const salt = +new Date();
  const sign = md5(`${baiduAppid}${currentContent}${salt}${baiduKey}`);
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${currentContent}&from=${getTranslateLan(currentLang)}&to=${getTranslateLan(targetLang)}&appid=${baiduAppid}&salt=${salt}&sign=${sign}`;

  const data = await fetch(url).then((res) => res.json());

  return data?.trans_result?.[0]?.dst;
};
