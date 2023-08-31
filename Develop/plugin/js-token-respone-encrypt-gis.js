'use strict';

const zlib = require('zlib');
const CryptoJS = require('crypto-js');

class TokenEncryotGisPlugin {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
  }

  async response(kong) {
    let key;
    let iv;
    let accessToken;
    let responbody = {};
    let saleschannel = await kong.request.getHeader("saleschannel");
    saleschannel = saleschannel.toUpperCase();
    if(saleschannel == "TNG")
    {
      key = "s5v8y/A?D(G-KbPeShVmYq3t6w9z$C&E",
      iv = "bQeThWmZq4t6w9z$"
    }
    else if(saleschannel == "ONESEVENLIFE")
    {
      key = "DuGhgYOmMiyT5rj1EqfEucMnuXC68KH4",
      iv = "(H-MbQeThWmYq3t6"
    }
    else if(saleschannel == "GIS")
    {
      key = "KbPeShVmYq3t6w9z$C&F2J@NcQfTjWnZ",
      iv = "FcJaNdRgUkXn2r5u"
    }
    else if(saleschannel == "OMNICHAT")
    {
      key = "hVmYq3t6w9z$C&F)J@NcQfTjWnZr4u7x",
      iv = "SgVkYp3s6v9y$B&E"
    }
    else if(saleschannel == "MYWATSONS")
    {
      key = "bFwJaNdRgUkXp2r5u8xdApD(G3KbPeSh",
      iv = "NcRfUjXn2r5u8xfA"
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

    let body = await kong.service.response.getRawBody();
    const rawBodyUncompressed = zlib.gunzipSync(body);
    var data = JSON.parse(rawBodyUncompressed.toString());
    
    if(data.hasOwnProperty('access_token'))
    {
    	accessToken = encrypt(data.access_token, key, iv);
      responbody.apitoken = accessToken;
    }
    if (await kong.response.get_status() == 200) {
      await kong.response.setHeader("Content-Encoding", "");
      await kong.response.exit(200, responbody)
    }
  }
}


module.exports = {
  Plugin: TokenEncryotGisPlugin,
  Schema: [
  ],
  Version: '0.1.0',
  Priority: 15,
};