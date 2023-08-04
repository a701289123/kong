'use strict';

const axios = require('axios');

class ServicecalloutPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        console.log("123")
        let target
        let header        
        let path = await kong.request.getPath()
        let host = await kong.request.getHost()
        var now = new Date();
        now.setHours(now.getHours() + 8);
        var year = now.getFullYear();
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var day = ("0" + now.getDate()).slice(-2);
        var hour = ("0" + now.getHours()).slice(-2);
        var minute = ("0" + now.getMinutes()).slice(-2);
        var second = ("0" + now.getSeconds()).slice(-2);
        var formattedTime = year + month + day + hour + minute + second;
        let requestBody = await kong.request.getBody();
        
        try {            
 
                let body = {}               
                body.lastLoginTime = formattedTime
                body.regTime = formattedTime
                
                if (requestBody.hasOwnProperty('X-JWT-HASH')) {
                
                    body.hashedId = requestBody['X-JWT-HASH']
                }
                
                let api
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
                    } else if (path.includes("wtcvn")) {
                        api = "https://api.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcvn";
                    }
                }
                else if(host == 'oocommapi2.aswatson.com')
                {
                    if (path.includes("wtchk")) {
                        api = "https://api.watsons.com.hk/api/v2/wtchk";
                    } else if (path.includes("wtcmy")) {
                        api = "https://api.watsons.com.my/api/v2/wtcmy";
                    } else if (path.includes("wtcsg")) {
                        api = "https://api.watsons.com.sg/api/v2/wtcsg";
                    } else if (path.includes("wtctw")) {
                        api = "https://api.watsons.com.tw/api/v2/wtctw";
                    } else if (path.includes("wtcph")) {
                        api = "https://api.watsons.com.ph/api/v2/wtcph";
                    } else if (path.includes("wtcid")) {
                        api = "https://api.watsons.co.id/api/v2/wtcid";
                    } else if (path.includes("wtcth")) {
                        api = "https://api.watsons.co.th/api/v2/wtcth";
                    } else if (path.includes("pnshk")) {
                        api = "https://api.parknshop.com/api/v2/pnshk";
                    } else if (path.includes("wtcvn")) {
                        api = "https://api.watsons.vn/api/v2/wtcvn";
                    }
                }
                target = api + PathSuffix
                if (body.hashedId != 'defaultRecommendationList' && body.hashedId) {
                    const response = await axios.post(target, body, { headers: header });
                    const responseData = response.data;
                    const setHeaderKong = Object.entries(responseData);
                    const obj = setHeaderKong.reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {});
                    requestBody.memberNumber = obj.memberNumber
                    
                    await kong.service.request.setBody(requestBody, "application/json");
                }

        } catch (error) {
            await kong.response.setHeader('error', error.message)
        }


    }
}

module.exports = {
    Plugin: ServicecalloutPlugin,    
    Version: '0.1.0',
    Priority: 1000,
};