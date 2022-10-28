import { useNavigate } from "react-router-dom";
import Styles from "./FormLayOut.module.css";
import FormUsuario from "./FormUsuario";

function FrmNovoUsuario() {
  const navigate = useNavigate();

  function createUsuario(dados) {
    // inicializar costs e servicos
    console.log("Informação chegou no post assim aqui   ==> " + JSON.stringify(dados));
    
    if (dados){
        fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token")},
          body: JSON.stringify(dados),
        })
          .then((resp) => resp.json())
          .then((data) => {
            console.log("Informação chegou no post assim ==> " +data);            
            navigate("/Usuario", { state: {message: 'Usuário criado com sucesso!'} });
          })
          .catch((err) => console.log("Erro ==> " + err),
            console.log("Erro 404, Não encontrado"),
            navigate("/Usuario", { state: {message: 'Usuário não foi criado, verifique as informações!'}})
          );
    }
  }
 
  return (
    <div className={Styles.LayOutForm}>
      <FormUsuario handleSubmit={createUsuario} btnText="Salvar" title={"Novo Usuário"} />
    </div>
  );
}

export default FrmNovoUsuario;