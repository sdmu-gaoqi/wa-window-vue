export const baiduLangs = [
  { label: "中文", command: "zh" },
  { label: "英语", command: "en" },
  { label: "日语", command: "jp" },
  { label: "韩语	", command: "kor" },
  { label: "繁体中文", command: "cht" },
];

export enum PostmessageType {
  翻译 = "translate",
  翻译完成 = "translateComplete",
  解密 = "aes",
  解密完成 = "aesComplete",
  打开页面 = "openPage",
}
