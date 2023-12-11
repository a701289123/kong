'use strict';

class DomainPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        let path = await kong.request.getPathWithQuery();
        let host = await kong.request.getHost();

        if (host == 'oocommapi2-dev.aswatson.com') {
            await kong.ctx.shared.set("x_forwarded_host", "uat");
        } else {
            await kong.ctx.shared.set("x_forwarded_host", "prod");
        }

        const config = {
            'wtchk': {
                CURR: "HKD",
                AI_KEY: 'GkEA8wSE1V3gPZjntiA5In4gvhU1xn3gwc1dhkNdRhfUAzFuoQ8ObA==',
                BU: "wtchk",
                AI_API: 'https://func-o2ai-wtchk-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtchk",
                API_PROD: "https://api.watsons.com.hk/api/v2/wtchk",
                ORIGIN_DEV: "https://wtchk.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.com.hk",
                UPSTREAM_DEV: "wtchk-dev",
                UPSTREAM_PROD: "wtchk-prod"
            },
            'wtcmy': {
                CURR: "MYR",
                AI_KEY: 'MrfwaurIVrW-ft4cVyWFHO4leP3XGFRrjzaw6DZxyQk6AzFuRDzqFA==',
                BU: "wtcmy",
                AI_API: 'https://func-o2ai-wtcmy-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcmy",
                API_PROD: "https://api.watsons.com.my/api/v2/wtcmy",
                ORIGIN_DEV: "https://wtcmy.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.com.my",
                UPSTREAM_DEV: "wtcmy-dev",
                UPSTREAM_PROD: "wtcmy-prod"
            },
            'wtcsg': {
                CURR: "SGD",
                AI_KEY: 'Bsj5kBG6wMO2frEFp_14Ed38_MvqacqDBUU4InDSAG-6AzFuig0oEQ==',
                BU: "wtcsg",
                AI_API: 'https://func-o2ai-wtcsg-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcsg",
                API_PROD: "https://api.watsons.com.sg/api/v2/wtcsg",
                ORIGIN_DEV: "https://wtcsg.cmb8j9fjhz-apj3aswat1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.com.sg",
                UPSTREAM_DEV: "wtcsg-dev",
                UPSTREAM_PROD: "wtcsg-prod"
            },
            'wtctw': {
                CURR: "TWD",
                AI_KEY: 'T64BLJJpfcQp3E7QEzdIpWeXW4nvB25lclZkf5Ps883sAzFuy7YKrQ==',
                BU: "wtctw",
                AI_API: 'https://func-o2ai-wtctw-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-apj4aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtctw",
                API_PROD: "https://api.watsons.com.tw/api/v2/wtctw",
                ORIGIN_DEV: "https://wtctw.cmb8j9fjhz-apj4aswat1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.com.tw",
                UPSTREAM_DEV: "wtctw-dev",
                UPSTREAM_PROD: "wtctw-prod"
            },
            'wtcph': {
                CURR: "PHP",
                AI_KEY: '2t8YayhZVVhyIGwe-hxOGKkEEyPB_gQOHOnuZno-m0AiAzFuukDYIg==',
                BU: "wtcph",
                AI_API: 'https://func-o2ai-wtcph-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-apj4aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcph",
                API_PROD: "https://api.watsons.com.ph/api/v2/wtcph",
                ORIGIN_DEV: "https://wtcph.cmb8j9fjhz-apj4aswat1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.com.ph",
                UPSTREAM_DEV: "wtcph-dev",
                UPSTREAM_PROD: "wtcph-prod"
            },
            'wtcid': {
                CURR: "IDR",
                AI_KEY: 'dT0LwyDbTv0aY2tFnGyeppHm52IZvLX-CIp8xQhZtqLDAzFu6rR87w==',
                BU: "wtcid",
                AI_API: 'https://func-o2ai-wtcid-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcid",
                API_PROD: "https://api.watsons.co.id/api/v2/wtcid",
                ORIGIN_DEV: "https://wtcid.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.co.id",
                UPSTREAM_DEV: "wtcid-dev",
                UPSTREAM_PROD: "wtcid-prod"
            },
            'wtcth': {
                CURR: "THB",
                AI_KEY: 'AhXXFyo3NJnl9EbV5RzmPgqBwYFQhZkRqbWDh5hhfuSfAzFuxtJpbQ==',
                BU: "wtcth",
                AI_API: 'https://func-o2ai-wtcth-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcth",
                API_PROD: "https://api.watsons.co.th/api/v2/wtcth",
                ORIGIN_DEV: "https://wtcth.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.co.th",
                UPSTREAM_DEV: "wtcth-dev",
                UPSTREAM_PROD: "wtcth-prod"
            },
            'pnshk': {
                CURR: "HKD",
                AI_KEY: 'BvBAOGpWfqMTpd2ldG0AatiktuFc-JuCxA5vL1KWygLSAzFuZTXrCA==',
                BU: "pnshk",
                AI_API: 'https://func-o2ai-pnshk-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-apj2aswat1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/pnshk",
                API_PROD: "https://api.pns.hk/api/v2/pnshk",
                ORIGIN_DEV: "https://pnshk.cmb8j9fjhz-apj2aswat1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.pns.hk",
                UPSTREAM_DEV: "pnshk-dev",
                UPSTREAM_PROD: "pnshk-prod"
            },
            'wtcvn': {
                CURR: "VND",
                AI_KEY: 'cwO5GdE6tgM7XbsJnYbadPdHo65iFTyxparEpl-Iv4hfAzFumwluYQ==',
                BU: "wtcvn",
                AI_API: 'https://func-o2ai-wtcvn-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtcvn",
                API_PROD: "https://api.watsons.vn/api/v2/wtcvn",
                ORIGIN_DEV: "https://wtcvn.cmb8j9fjhz-aswatsona1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.vn",
                UPSTREAM_DEV: "wtcvn-dev",
                UPSTREAM_PROD: "wtcvn-prod"
            },
            'wtctr': {
                CURR: "TWD",
                AI_KEY: 'cnxCT7KGPz3353r4lgYc4N4WMiK_s3cbOQn2UMG1KkFYAzFuljqEWw==',
                BU: "wtctr",
                AI_API: 'https://func-o2ai-wtctr-prod-eastasia.azurewebsites.net/api',
                API_DEV: "https://api.cmb8j9fjhz-aswatsonh1-s1-public.model-t.cc.commerce.ondemand.com/api/v2/wtctr",
                API_PROD: "https://api.watsons.com.tr/api/v2/wtctr",
                ORIGIN_DEV: "https://wtctr.cmb8j9fjhz-aswatsonh1-s1-public.model-t.cc.commerce.ondemand.com",
                ORIGIN_PROD: "https://www.watsons.com.tr",
                UPSTREAM_DEV: "wtcrt-dev",
                UPSTREAM_PROD: "wtcrt-prod"
            },
            'wwhk': {
                CURR: "HKD",
                AI_KEY: 'lE6kIwC2Cab0IEdgg-jsv_51aSBER6exeWB8pzpZCcGnAzFu70OAPw==',
                BU: "wwhk",
                AI_API: 'https://func-o2ai-wwhk-prod-eastasia.azurewebsites.net/api',
                API_DEV: "",
                API_PROD: "",
                ORIGIN_DEV: "",
                ORIGIN_PROD: "",
                UPSTREAM_DEV: "wwhk-dev",
                UPSTREAM_PROD: "wwhk-prod"
            }
        };

        try {
            for (let key in config) {
                if (path.includes(key)) {
                    let environment = host == 'oocommapi2-dev.aswatson.com' ? 'DEV' : 'PROD';
                    await kong.ctx.shared.set("domain", config[key]['API_' + environment]);
                    await kong.ctx.shared.set("baseSiteId", config[key].BU);
                    await kong.ctx.shared.set("aiKey", config[key].AI_KEY);
                    await kong.ctx.shared.set("curr", config[key].CURR);
                    await kong.ctx.shared.set("upstream", config[key]['UPSTREAM_' + environment]);
                    await kong.ctx.shared.set("url", config[key]['ORIGIN_' + environment]);
                    await kong.ctx.shared.set("aiApi", config[key].AI_API);
                }
            }
        } catch (error) {
            await kong.response.setHeader('error', error.message)
        }


    }
}

module.exports = {
    Plugin: DomainPlugin,
    Version: '0.1.0',
    Priority: 1000002,
};
