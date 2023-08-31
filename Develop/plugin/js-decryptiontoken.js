const CryptoJS = require('crypto-js');

class AESDecryptionPlugin {
    constructor(config) {
        this.config = config;
    }

    async access(kong) {
        try {
            const encryptedMessage = this.config.plaintext || await kong.request.getHeader("Authorization");;
            let key = "";
            let iv = "";
            let saleschannel = await kong.request.getHeader("saleschannel")
            if (saleschannel) {
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
            }
            if (this.config.key && this.config.iv) {
                key = this.config.key;
                iv = this.config.iv;
            }

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
                await kong.service.request.setHeader('Authorization', decryptedMessage);
            }
        } catch (error) {
            await kong.response.exit(400, { 'Failed to decrypt message': 'error' })
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
    Priority: 1000,
};
