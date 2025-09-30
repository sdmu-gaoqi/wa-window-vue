import CryptoJS from "crypto-js";

export const truncate = (q: string) => {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
};

export const generateYoudaoSignature = (
  appKey: string,
  appSecret: string,
  query: string
) => {
  // 生成随机数
  const salt = Math.random().toString(36).substring(2, 15);
  // 生成时间戳（秒级）
  const ts = Math.round(new Date().getTime() / 1000);
  // 拼接签名原始字符串
  const signStr = appKey + truncate(query) + salt + ts + appSecret;
  // 计算MD5哈希值作为签名
  const sign = CryptoJS.SHA256(signStr).toString(CryptoJS.enc.Hex);

  return {
    salt,
    ts,
    sign,
  };
};
