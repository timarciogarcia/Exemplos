import Styles from "../FormLayOut/FormLayOut.module.css";
var cryptojs = require("crypto-js");

//cria a função para fazer a criptografia
function criptografar(texto) {
  var cripto = cryptojs.AES.encrypt(texto, "chave");
  return cripto.toString();
}

//cria a função para descriptografar
function descriptografar(texto) {
  var descripto = cryptojs.AES.decrypt(texto, "chave");
  return descripto.toString(cryptojs.enc.Utf8);
}

function Administracao() {
  return (
    <div className={Styles.LayOutForm}>
      <h1>Administracao</h1>
      <p>{localStorage.getItem("token")}</p>
    </div>
  );
}
export default Administracao;
