'use strict';

const axios = require('axios');

class ServicecalloutPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        let target;
        let header;        
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
        const domain = await kong.ctx.shared.get("domain");
        
        try {            
            let body = {}               
            body.lastLoginTime = formattedTime
            body.regTime = formattedTime

            if (requestBody.hasOwnProperty('X-JWT-HASH')) {
                body.hashedId = requestBody['X-JWT-HASH']

                let PathSuffix = "/subClub/verify?fields=O2AI"
                target = domain + PathSuffix
                
                if (body.hashedId != 'defaultRecommendationList' && body.hashedId) {
                    
                    const response = await axios.post(target, body, { headers: header });
                    const responseData = response.data;
                    const setHeaderKong = Object.entries(responseData);
                    const obj = setHeaderKong.reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {});
                    requestBody.memberNumber = obj.memberNumber
                    delete requestBody["X-JWT-HASH"];
                    await kong.service.request.setBody(requestBody, "application/json");
                }else if(body.hashedId == 'defaultRecommendationList' && body.hashedId){
                    requestBody.memberNumber = '-1';
                    delete requestBody["X-JWT-HASH"];
                    await kong.service.request.setBody(requestBody, "application/json");
                }
            }else{
                await kong.service.request.setBody(body, "application/json");
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