import { useNavigate} from "react-router-dom";
import Styles from "./FormLayOut.module.css";
import FormUsuario from "./FormUsuario";
import axios from "axios";

export const apiUsuario = axios.create();

function FrmNovoUsuario() {
  const navigate = useNavigate();
  const createUsuario = (dados) => {    

    if (dados){
      const Retorno = apiUsuario.post("http://localhost:5000/users", dados, 
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-access-token": localStorage.getItem("token")
        },
      })
      if (!Retorno.data.id) {
        alert(Retorno.data.error);
      } else {
        alert("Usuario criado com sucesso");
        navigate("/usuarios", { state: { message : "Criado com Sucesso!" } }); 
      }
    }
  };


  return (
    <div className={Styles.LayOutForm}>
      <FormUsuario handleSubmit={createUsuario} btnText="Salvar" title={"Novo Usuário"} />
    </div>
  );
}

export default FrmNovoUsuario;


