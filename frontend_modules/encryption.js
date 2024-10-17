import CryptoJS from "crypto-js";
import { SHA256 } from "crypto-js";

export { encryptMsg, checkKey, decryptMsg };

function sha(msg) {
  return SHA256(msg).toString();
}

function encryptMsg(msg, key) {
  return CryptoJS.AES.encrypt(
    JSON.stringify({ msg: `${msg}===SHA256===${sha(msg)}` }),
    key
  ).toString();
}

// Only call this after making sure the key is valid
// Will only work properly with message that were encrypted with the encryptMsg function
function decryptMsg(cipher, key) {
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  const msg = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)).msg;
  return msg.slice(0, msg.lastIndexOf("===SHA256==="));
}

function checkKey(cipher, key) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, key);
    const msg = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)).msg;
    const msgNoSha = msg.substring(0, msg.lastIndexOf("===SHA256==="));
    const sha = msg.substring(
      msg.lastIndexOf("===SHA256===") + "===SHA256===".length
    );
    return SHA256(msgNoSha).toString() === sha;
  } catch (err) {
    return false;
  }
}
