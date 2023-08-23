'use strict';

const zlib = require('zlib');

class wtcModifaceApis {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
    }
    async response(kong) {
        let body = await kong.service.response.getRawBody();
        const rawBodyUncompressed = zlib.gunzipSync(body);


        var data = JSON.parse(rawBodyUncompressed.toString());
        var dataProduct = data.products[0]
        if (dataProduct) {
            let lang = await kong.request.getQueryArg("lang");
            var newRespone = {};
            if (dataProduct.defaultVariantCode)
                var sku = dataProduct.defaultVariantCode;
            else
                var sku = "";
            var availability = dataProduct.stock.stockLevelStatus;
            var price = dataProduct.price.formattedValue;
            var packshotImageUrl
            packshotImageUrl = dataProduct.images[0].url;
            var pdpUrl = dataProduct.url;
            var buCode = await kong.request.getQueryArg("target");
            var ctxDomain = await kong.ctx.shared.get("domain")
            var domain
            newRespone.sku = sku
            newRespone.addToCartSku = sku
            if (dataProduct.masterBrand.name)
                newRespone.brandLabel = dataProduct.masterBrand.name
            else
                newRespone.brandLabel = ""
            if (dataProduct.name)
                newRespone.name = dataProduct.name
            else
                newRespone.name = ""
            // if (dataProduct.hasOwnProperty("shortDescription"))    
            if (dataProduct.shortDescription)
                newRespone.shortDescription = dataProduct.shortDescription
            else
                newRespone.shortDescription = ""

            //send request
            if (sku !== undefined) {
                if (ctxDomain) {

                    const url = new URL(ctxDomain)
                    const parts = url.hostname.split('.')
                    domain = parts.slice(1).join('.');

                    if (domain.includes('model-t'))
                        var webPrefix = "https://" + buCode + ".";
                    else
                        var webPrefix = "https://www.";
                }

                var apiPrefix = "https://api."

            }


            if (packshotImageUrl !== undefined && domain) {
                newRespone.packshotImageUrl = apiPrefix + domain + packshotImageUrl;
            }
            else
                newRespone.packshotImageUrl = ""
            if (pdpUrl !== undefined && domain) {
                newRespone.pdpUrl = webPrefix + domain + pdpUrl;
            }
            else
                newRespone.pdpUrl = ""
            if (dataProduct.averageRating || dataProduct.averageRating == 0)
                newRespone.rating = dataProduct.averageRating.toString()
            else
                newRespone.rating = ""

            if (dataProduct.productNumberOfReview || dataProduct.productNumberOfReview == 0)
                newRespone.ratingCount = dataProduct.productNumberOfReview.toString()
            else
                newRespone.ratingCount = ""

            newRespone.eCommerce = {}
            if (price !== undefined && (lang == "en_VN" || lang == "vi")) {
                newRespone.eCommerce.price = price.replace(/\D+$/g, '');
            } else if (price !== undefined) {
                newRespone.eCommerce.price = price.replace(/^\D+/g, '');
            } else {
                newRespone.eCommerce.price = ""
            }
            if (dataProduct.price.currencyIso)
                newRespone.eCommerce.currency = dataProduct.price.currencyIso
            else
                newRespone.eCommerce.currency = ""
            if (dataProduct.contentSizeUnit)
                newRespone.eCommerce.size = dataProduct.contentSizeUnit
            else
                newRespone.eCommerce.size = ""

            if (availability == "inStock" || availability == "lowStock") {
                newRespone.eCommerce.availability = "in stock";
            }
            else {
                newRespone.eCommerce.availability = "out of stock";
            }

        } else {
            newRespone = {
                "sku": "",
                "addToCartSku": "",
                "brandLabel": "",
                "name": "",
                "shortDescription": "",
                "packshotImageUrl": "",
                "pdpUrl": "",
                "rating": "",
                "ratingCount": "",
                "eCommerce": {
                    "price": "",
                    "currency": "",
                    "size": "",
                    "availability": "out of stock"
                }
            }
        }
        if (await kong.response.get_status() == 200) {
            await kong.response.setHeader("Content-Encoding", "");
            await kong.response.exit(200, newRespone)
        }




    }
}

module.exports = {
    Plugin: wtcModifaceApis,
    Version: '0.1.0',
    Priority: 760,
};