'use strict';

const CryptoJS = require('crypto-js');

class AESDecryptionPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        try {
            const requestBody = await kong.request.getBody()
            const encryptedMessage = this.config.ciphertext || requestBody.ciphertext;
            const key = this.config.key || requestBody.key;
            const iv = this.config.iv || requestBody.iv;


            if (encryptedMessage && key && iv) {

                //解密
                function decrypt(word, keyStr, ivStr) {
                    let key = CryptoJS.enc.Utf8.parse(keyStr);
                    let iv = CryptoJS.enc.Utf8.parse(ivStr);

                    let decrypt = CryptoJS.AES.decrypt(word, key, {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });

                    return decrypt.toString(CryptoJS.enc.Utf8);
                }


                const decryptedMessage = decrypt(encryptedMessage, key, iv)
                const newBody = {
                    "output": decryptedMessage
                }
                await kong.response.exit(200, newBody)

            }
        } catch (error) {
            console.error('Failed to decrypt message:', error);
        }
    }
}

module.exports = {
    Plugin: AESDecryptionPlugin,
    Schema: [
        { ciphertext: { type: "string" } },
        { key: { type: "string" } },
        { iv: { type: "string" } },
    ],
    Version: '0.1.0',
    Priority: 0,
};