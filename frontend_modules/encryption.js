import CryptoJS from "crypto-js";

export {
  encryptMsg,
  checkKey,
  decryptMsg,
};

function encryptMsg(msg, key) {
  return CryptoJS.AES.encrypt(JSON.stringify({ msg }), key).toString();
}

function checkKey(cipher, key) {
  return CryptoJS.AES.decrypt(cipher, key).sigBytes >= 0;
}

function decryptMsg(cipher, key) {
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
