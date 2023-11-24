import { AES, enc, mode as _mode, pad } from "crypto-js";

export const aesDecrypt = (
  input: string,
  key: string,
  options?: Partial<{
    mode: any;
    padding: any;
    digit: number;
  }>
) => {
  try {
    const { mode = _mode.CBC, padding = pad.Pkcs7, digit = 16 } = options || {};
    const secretKey = enc.Utf8.parse(key);
    const iv = enc.Utf8.parse(key.substring(0, digit));
    const decrypted = AES.decrypt(input, secretKey, {
      iv,
      mode,
      padding,
    });
    return decrypted.toString(enc.Utf8);
  } catch (err) {
    return "";
  }
};
