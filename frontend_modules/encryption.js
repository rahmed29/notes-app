export { encryptMsg, checkKey, decryptMsg };

//
// Yeah idk what I was thinking. These were definitely not secure and should never have been used to store anything that truly needed to be encrypted.
// For stuff that really needs to be secure, a secure note on Bitwarden or something like that is great.
// So I am going to remove the "encrypted notes" features but I'm lazy so I don't want to go and remove all occurences of it so I'll just make these dummy function I guess
//

function encryptMsg(msg, key) {
  return "Encrypted notebooks are gone";
}

function decryptMsg(cipher, key) {
  return "Encrypted notebooks are gone";
}

function checkKey(cipher, key) {
  return true;
}
