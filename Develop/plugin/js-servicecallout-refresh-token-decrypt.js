'use strict';

const axios = require('axios');

class ServicecalloutPlugin {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    const requestBody = await kong.request.getBody()
    let retoken;
    if (requestBody.hasOwnProperty('refresh_token')) {
      retoken = requestBody.refresh_token;
    }
    else {
      retoken = ""
    }
    await kong.service.request.setHeader("refreshtoken", retoken);
    const target = this.config.target;
    const header = { apikey: "pnBxGMAeDrw4JzAndApJGzPk8e6hCHElvHo79b0Go0fv9YKq" };
    const body = this.config.body || {};
    body.ciphertext = retoken;
    let key;
    let iv;
    let saleschannel = await kong.request.getHeader("saleschannel")



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


    try {
      body.key = key;
      body.iv = iv;
      const response = await axios.post(target, body, { headers: header });
      const responseData = response.data;
      if (responseData.output)
        requestBody.refresh_token = responseData.output
      await kong.service.request.setBody(requestBody, "application/x-www-form-urlencoded");
    } catch (error) {
      console.error(error);
    }
  }
}


module.exports = {
  Plugin: ServicecalloutPlugin,
  Schema: [
    { target: { type: "string" } },
    { header: { type: "record", fields: {} } },
    { body: { type: "record", fields: {} } }
  ],
  Version: '0.1.0',
  Priority: 1000,
};