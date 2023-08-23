'use strict';

const axios = require('axios');

class ServicecalloutPlugin {
  constructor(config) {
    this.config = config;
  }

  async access(kong) {
    const target = this.config.target;
    const header = this.config.header;
    const body = this.config.body;
    const method = this.config.method;

    var now = new Date();
    now.setHours(now.getHours() + 8);
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);
    var hour = ("0" + now.getHours()).slice(-2);
    var minute = ("0" + now.getMinutes()).slice(-2);
    var second = ("0" + now.getSeconds()).slice(-2);
    var formattedTime = year + month + day + hour + minute + second;

    header  = header.reduce((acc, item) => {
      const [key, value] = item.split(':');
      acc[key] = value;
      return acc;
    }, {});


    if (method == 'GET') {
      try {
        const response = await axios.get(target, { headers: header });
        const responseData = response.data;
        const setHeaderKong = Object.entries(responseData);
        for (const [key, value] of setHeaderKong) {
          await kong.service.request.setHeader(key.toString(), value.toString());
        }
      } catch (error) {
        console.error(error);
      }
    }
    else if (method == 'POST') {
      try {
        if (target.includes('subClub')) {                   //這邊if可以不用
          body = {}
          body.lastLoginTime = formattedTime
          body.regTime = formattedTime
          let hashedId = await kong.request.getHeader("X-JWT-HASH")
          if(hashedId)
          body.hashedId = hashedId
          let host = await kong.request.getHost()
          let path = await kong.request.getPath()
          let PathSuffix = "/subClub/verify?fields=O2AI"
          if (host == 'oocommapi2-dev.aswatson.com') {
            if (path.includes("wtchk")) {
                api = "https://api.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtchk";
            } else if (path.includes("wtcmy")) {
                api = "https://api.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcmy";
            } else if (path.includes("wtcsg")) {
                api = "https://api.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcsg";
            } else if (path.includes("wtctw")) {
                api = "https://api.cmb8j9fjhz-apj4aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtctw";
            } else if (path.includes("wtcph")) {
                api = "https://api.cmb8j9fjhz-apj4aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcph";
            } else if (path.includes("wtcid")) {
                api = "https://api.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcid";
            } else if (path.includes("wtcth")) {
                api = "https://api.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcth";
            } else if (path.includes("pnshk")) {
                api = "https://api.cmb8j9fjhz-apj2aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/pnshk";
            }
            target = api + PathSuffix
          }
        }
        await kong.service.request.setHeader('test', 'cicd2');
        const requestBody = await kong.request.getBody()
        const response = await axios.post(target, body, { headers: header });
        // console.log(body)
        const responseData = response.data;
        const setHeaderKong = Object.entries(responseData);
        for (const [key, value] of setHeaderKong) {
          await kong.service.request.setHeader(key.toString(), value.toString());
          if(key.toString() == 'memberNumber')
          requestBody.memberNumber = value.toString()
        }
      } catch (error) {
        // console.error(error);
      }
    }
    
    // else if (method == 'PATCH') {
    //   try {
    //     const response = await axios.patch(target, body, { headers: header });
    //     const responseData = response.data;
    //     const setHeaderKong = Object.entries(responseData);
    //     for (const [key, value] of setHeaderKong) {
    //       await kong.service.request.setHeader(key.toString(), value.toString());
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    // else if (method == 'DELETE') {
    //   try {
    //     const response = await axios.delete(target, { headers: header });
    //     const responseData = response.data;
    //     const setHeaderKong = Object.entries(responseData);
    //     for (const [key, value] of setHeaderKong) {
    //       await kong.service.request.setHeader(key.toString(), value.toString());
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }    
  }
}

module.exports = {
  Plugin: ServicecalloutPlugin,
  Schema: [
    { method: { type: "string" } },
    { target: { type: "string" } },
    // { params: { type: "string" } },
    { header: { type: "array", elements: { type: "string" } } },
        { body: { type: "array", elements: { type: "string" } } },
  ],
  Version: '0.1.0',
  Priority: 0,
};