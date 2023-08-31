'use strict';

const CryptoJS = require("crypto-js");

class AESEncryptionPlugin {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    const plaintext = this.config.plaintext || await kong.request.getHeader("Authorization");
    let key = "";
    let iv = "";
    let saleschannel = await kong.request.getHeader("saleschannel")
    if (saleschannel) {
      saleschannel = saleschannel.toUpperCase();

      if (saleschannel == "TNG") {
        key = "s5v8y/A?D(G-KbPeShVmYq3t6w9z$C&E",
          iv = "bQeThWmZq4t6w9z$"
      }
      else if (saleschannel == "ONESEVENLIFE") {
        key = "DuGhgYOmMiyT5rj1EqfEucMnuXC68KH4",
          iv = "(H-MbQeThWmYq3t6"
      }
      else if (saleschannel == "GIS") {
        key = "KbPeShVmYq3t6w9z$C&F2J@NcQfTjWnZ",
          iv = "FcJaNdRgUkXn2r5u"
      }
      else if (saleschannel == "OMNICHAT") {
        key = "hVmYq3t6w9z$C&F)J@NcQfTjWnZr4u7x",
          iv = "SgVkYp3s6v9y$B&E"
      }
      else if (saleschannel == "MYWATSONS") {
        key = "bFwJaNdRgUkXp2r5u8xdApD(G3KbPeSh",
          iv = "NcRfUjXn2r5u8xfA"
      }
    }
    if (this.config.key && this.config.iv) {
      key = this.config.key;
      iv = this.config.iv;
    }


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


    if (typeof plaintext != 'object' && (plaintext.includes("bearer") || plaintext.includes("Bearer"))) {
      var arrayBearer = plaintext.split(" ")
      if (plaintext.includes("Bearer bearer") || plaintext.includes("Bearer Bearer")) {
        plaintext = arrayBearer[2];
      }
      else {
        plaintext = arrayBearer[1];
      }
    }

    const ciphertext = encrypt(plaintext, key, iv)

    await kong.service.request.setHeader('Authorization', ciphertext);
  }
}

module.exports = {
  Plugin: AESEncryptionPlugin,
  Schema: [
    { plaintext: { type: "string" } },
    { key: { type: "string" } },
    { iv: { type: "string" } },
  ],
  Version: '0.1.0',
  Priority: 1000,
};