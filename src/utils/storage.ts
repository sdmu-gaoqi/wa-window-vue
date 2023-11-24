export const storage = {
  getAesKey: () => {
    return localStorage.getItem("aesKey") || "";
  },
  setAesKey: (key: string) => {
    localStorage.setItem("aesKey", key);
  },
};
