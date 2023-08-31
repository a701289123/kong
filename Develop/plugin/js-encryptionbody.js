'use strict';

const CryptoJS = require("crypto-js");

class AESEncryptionPlugin {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    const plaintext = await kong.request.getRawBody();
    const key = this.config.key;
    const iv = this.config.iv;

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
    const ciphertext = encrypt(plaintext, key, iv)
    const newtext ={
      "value": {
                "type": "JSON",
        "data": {
          "encryptedRecords": ciphertext
        }
      }
    }
    await kong.service.request.setBody(newtext,"application/json");
  }
}

module.exports = {
  Plugin: AESEncryptionPlugin,
  Schema: [
    // { plaintext: { type: "string" } },
    { key: { type: "string" } },
    { iv: { type: "string" } },
  ],
  Version: '0.1.0',
  Priority: 0,
};