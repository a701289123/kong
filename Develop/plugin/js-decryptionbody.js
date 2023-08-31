const CryptoJS = require('crypto-js');

class AESDecryptionPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        try {
            const encryptedMessage = this.config.plaintext;
            const key = this.config.key;
            const iv = this.config.iv;
            console.log('encryptedMessage', encryptedMessage)
            if (encryptedMessage && key && iv) {
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
                console.log('decryptedMessage', decryptedMessage)
                    
            }
        } catch (error) {
            console.error('Failed to decrypt message:', error);
        }
    }
}

module.exports = {
    Plugin: AESDecryptionPlugin,
    Schema: [
        { plaintext: { type: "string" } },
        { key: { type: "string" } },
        { iv: { type: "string" } },
    ],
    Version: '0.1.0',
    Priority: 0,
};
