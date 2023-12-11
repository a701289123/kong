'use strict';

const axios = require('axios');

class ServicecalloutPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        let header = {};
        let body;
        let pathSuffix;
        let queryParam = '';
        let target;
        const method = this.config.method.toLowerCase();
        const contentType = await kong.request.getHeader('content-type');


        const configHeader = this.config.header;
        const ctxHeader = await kong.ctx.shared.get('ctxHeaderObj');
         
        if (configHeader){
            const resultObject = {}; 
            configHeader.forEach(item => {
                const [key, value] = item.split(':');
                resultObject[key] = value;
            });  
            header = resultObject;
        }else if (ctxHeader){
            header = ctxHeader;
        }

        
        const configBody = this.config.body;
        const requestBody = await kong.request.getBody();
        
        const ctxBody = 
        await kong.ctx.shared.get('ctxBodyObj');

        if (configBody){
            const configBodyParsed = JSON.parse(configBody);
            body = configBodyParsed;
        }else if (ctxBody){
            body = ctxBody;
        }else {
            body = requestBody;
        }
        
        const configPathSuffix = this.config.pathSuffix;
        const ctxPathSuffix =  await kong.ctx.shared.get('ctxPathSuffixStr');

        const configQueryParam = this.config.queryParam;
        const ctxQueryParam =  await kong.ctx.shared.get('ctxQueryParamStr');
        
        if (configQueryParam && configQueryParam.length !== 0){
            queryParam = configQueryParam.map(item => {
                const [key, value] = item.split(':');
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }).join('&');
        }else if (ctxQueryParam){
            queryParam = ctxQueryParam;
        }

        if (queryParam){
            if (configPathSuffix){
                if (configPathSuffix.includes('?')) {
                    pathSuffix = configPathSuffix + queryParam;
                }
                else {
                    pathSuffix = configPathSuffix + '?' + queryParam;
                }
            }else if (ctxPathSuffix) {
                if (configPathSuffix.includes('?')) {
                    pathSuffix = ctxPathSuffix + queryParam;
                }
                else {
                    pathSuffix = ctxPathSuffix + '?' + queryParam;
                }
            }    
        }else {
            if (configPathSuffix){
                pathSuffix = configPathSuffix;
            }else if (ctxPathSuffix) {
                pathSuffix = ctxPathSuffix;
            }   
        }


        const domain = await kong.ctx.shared.get('domain');
        const targetEndpoint = this.config.targetEndpoint || await kong.ctx.shared.get('targetEndpoint');

        if (pathSuffix && domain){
            target = domain + pathSuffix;
        }else if (targetEndpoint){
            if (queryParam){
                if (targetEndpoint.includes('?')) {
                    target = targetEndpoint + queryParam;
                }
                else {
                    target = targetEndpoint + '?' + queryParam;
                }
            }else {
                target = targetEndpoint;
            }
        }
        

        try {
            let response;
            if (method === 'get') {
                response = await axios.get(target, { headers: header });
            } else {
                if (contentType.includes('json')){
                    response = await axios[method](target, body, { headers: header });
                }else {
                    response = await axios[method](target, body, { headers: header, transformRequest: [function (data) {
                        const formData = new URLSearchParams();
                        for (const key in data) {
                          formData.append(key, data[key]);
                        }
                        return formData.toString();
                    }],});
                }
            }    

            const responseData = response.data;
            const setHeaderKong = Object.entries(responseData);
            const obj = setHeaderKong.reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
            await kong.ctx.shared.set('obj', obj);
            
        } catch (error) {
            await kong.service.request.setHeader('axios${method}Error', error.message)
        }
    }
}

module.exports = {
  Plugin: ServicecalloutPlugin,
  Schema: [
      { method: { type: "string" } },
      { header: { type: "array", elements: { type: "string" } } },
      { body: { type: "string"}},
      { pathSuffix: { type: "string" } },
      { queryParam: { type: "array", elements: { type: "string" } } },
      { targetEndpoint: { type: "string" } }
  ],
  Version: '0.1.0',
  Priority: 1000,
};