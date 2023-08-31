'use strict';

const CryptoJS = require("crypto-js");

class AESEncryptionPlugin {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    const requestBody = await kong.request.getBody()
    const cleartext = this.config.cleartext || requestBody.cleartext;
    const key = this.config.key || requestBody.key;
    const iv = this.config.iv || requestBody.iv;


    function encrypt(word, keyStr, ivStr) {
      let key = CryptoJS.enc.Utf8.parse(keyStr);
      let iv = CryptoJS.enc.Utf8.parse(ivStr);
      let srcs = CryptoJS.enc.Utf8.parse(word);
    
      let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    
      return encrypted.toString();
    }

    
    const ciphertext = encrypt(cleartext, key, iv)
    const newBody = {
      "ciphertext": ciphertext
    }
    await kong.response.exit(200, newBody)
  }
}

module.exports = {
  Plugin: AESEncryptionPlugin,
  Schema: [
    { cleartext: { type: "string" } },
    { key: { type: "string" } },
    { iv: { type: "string" } },
  ],
  Version: '0.1.0',
  Priority: 0,
};