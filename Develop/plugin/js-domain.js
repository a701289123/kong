'use strict';

class ServicecalloutPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        let path = await kong.request.getPathWithQuery();
        let host = await kong.request.getHost();
        let api;
        
        try {                            
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
            await kong.ctx.shared.set("domain",api)
            

        } catch (error) {
            await kong.response.setHeader('error', error.message)
        }
    }
}

module.exports = {
    Plugin: ServicecalloutPlugin,    
    Version: '0.1.0',
    Priority: 1001,
};