const cryptojs = require("crypto-js");

export function criptografar(texto) {
    var cripto = cryptojs.AES.encrypt(texto, process.env.CRYPTO_SECRET);
    return cripto.toString();
  }
  
  export function descriptografar(texto) {
    var descripto = cryptojs.AES.decrypt(texto, process.env.CRYPTO_SECRET);
    return descripto.toString(cryptojs.enc.Utf8);
  }
  
 