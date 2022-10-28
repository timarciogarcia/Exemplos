import Input from "../FormComponents/Input";
import Select from "../FormComponents/Select";
import Submit from "../FormComponents/Submit";
import styles from "./FormLayOut.module.css";
import { useEffect, useState } from "react";

function FormUsuario({ handleSubmit, btnText, formData, title }) {
  const [cargos, setCargos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [dados, setDados] = useState(formData || {});

  console.log("Dados -> " + JSON.stringify(dados));
  //Cargos
  useEffect(() => {
    fetch("http://localhost:5000/cargos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCargos(data[0]);
        console.log("Cargos -> " + JSON.stringify(cargos));
      })
      .catch((err) => console.log(err));
  }, []);

  //Departamentos
  useEffect(() => {
    fetch("http://localhost:5000/departamentos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setDepartamentos(data[0]);
        console.log("Deptos -> " + JSON.stringify(departamentos));
      })
      .catch((err) => console.log(err));
  }, []);

  const submit = (e) => {
    e.preventDefault();
    console.log(dados);
    handleSubmit(dados);
  };

  function handleChange(e) {
    setDados({ ...dados, [e.target.name]: e.target.value });
  }

  function handleCargo(e) {
    setDados({
      ...dados,
      rhcargo_id: e.target.value,
    });
    console.log(e.target.value);
  }
  //        name: e.target.options[e.target.selectedIndex].text,

  function handleDepartamento(e) {
    setDados({
      ...dados,
      rhdepartamento_id: e.target.value,
      password: "123456",
    });
    console.log(e.target.value);
  }

  return (
    <div className={styles.LayOutForm}>
        <form onSubmit={submit} className={styles.form} noValidate>
        <div>
          <h2 className={styles.h2}>{title}</h2>
          <Input
            type="text"
            text="Nome"
            name="name"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.name ? dados.name : ""}
            mywidth="120"
          /><Input
            type="email"
            text="E-mail"
            name="email"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.email ? dados.email : ""}
            mywidth="60"
          />
          <Input
            type="text"
            text="Telefone"
            name="celphone"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.celphone ? dados.celphone : ""}
            mywidth="13"
          />
          <Input
            type="text"
            text="RG"
            name="rg"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.rg ? dados.rg : ""}
            mywidth="15"
          />
          <Input
            type="text"
            text="CPF"
            name="cpf"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.cpf ? dados.cpf : ""}
            mywidth="15"
          />

          <Input
            type="text"
            text="Cep"
            name="cep"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.cep ? dados.cep : ""}
            mywidth="9"
          />
          <Input
            type="text"
            text="Logradouro"
            name="logradouro"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.logradouro ? dados.logradouro : ""}
            mywidth="120"
          />
          <Input
            type="text"
            text="Numero"
            name="numero"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.numero ? dados.numero : ""}
            mywidth="6"
          />
        </div>  
        <div>  
          <Input
            type="text"
            text="Complemento"
            name="complemento"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.complemento ? dados.complemento : ""}
            mywidth="15"
          />
          <Input
            type="text"
            text="Bairro"
            name="bairro"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.bairro ? dados.bairro : ""}
            mywidth="25"
          />
          <Input
            type="text"
            text="Cidade"
            name="cidade"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.cidade ? dados.cidade : ""}
            mywidth="30"
          />
          <Input
            type="text"
            text="UF"
            name="uf"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.uf ? dados.uf : ""}
            mywidth="2"
          />
          <Input
            type="text"
            text="Estado"
            name="estado"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.estado ? dados.estado : ""}
            mywidth="15"
          />
          <Input
            type="text"
            text="Observaçoes"
            name="observacoes"
            placeholder=""
            handleOnChange={handleChange}
            value={dados.observacoes ? dados.observacoes : ""}
            mywidth="300"
          />
          <Select
            text="Selecione o Cargo"
            name="rhcargo_id"
            options={cargos}
            handleOnChange={handleCargo}
            value={dados.rhcargo_id ? dados.rhcargo_id : ""}
          />
          <Select
            text="Selecione o Departamento"
            name="rhdepartamento_id"
            options={departamentos}
            handleOnChange={handleDepartamento}
            value={dados.rhdepartamento_id ? dados.rhdepartamento_id : ""}
          />
        </div>

          <Submit text={btnText} />
        </form>
    </div>
  );
}

export default FormUsuario;
