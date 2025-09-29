import md5 from "md5";

export const truncate = (q: string) => {
  if (q === null) {
    return "";
  }
  const len = q.length;
  return len <= 20 ? q : q.substring(0, 10) + len + q.substring(len - 10, len);
};

export const generateYoudaoSignature = (appKey, appSecret, query) => {
  // 生成随机数
  const salt = Math.random().toString(36).substring(2, 15);
  // 生成时间戳（秒级）
  const ts = Math.floor(Date.now() / 1000).toString();
  // 拼接签名原始字符串
  const signStr = appKey + truncate(query) + salt + ts + appSecret;
  // 计算MD5哈希值作为签名
  const sign = md5(signStr);

  return {
    salt,
    ts,
    sign,
  };
};
