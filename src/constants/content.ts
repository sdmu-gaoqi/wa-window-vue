export const baiduLangs = [
  { label: "中文", value: "zh" },
  { label: "英语", value: "en" },
  { label: "日语", value: "jp" },
  { label: "韩语	", value: "kor" },
  { label: "繁体中文", value: "cht" },
];

export enum PostmessageType {
  翻译 = "translate",
  翻译完成 = "translateComplete",
  解密 = "aes",
  解密完成 = "aesComplete",
  打开页面 = "openPage",
  storageGet = "storageGet",
  storageSet = "storageSet",
}

export enum TranslateApp {
  百度翻译 = "baidu",
  有道翻译 = "youdao",
}

export const translateApp = [
  { label: "百度翻译", value: TranslateApp.百度翻译 },
  { label: "有道翻译", value: TranslateApp.有道翻译 },
];

export const translateAppKV = {
  [TranslateApp.百度翻译]: { appid: "windowBaiduAppid", key: "windowBaiduKey" },
  [TranslateApp.有道翻译]: { appid: "windYoudaoAppid", key: "windYoudaoKey" },
};
