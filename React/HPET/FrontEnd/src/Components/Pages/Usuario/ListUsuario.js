import Styles from "./FormLayOut.module.css";
import { useState } from "react";
import { useEffect } from "react";
import LinkButton from "../../LayOut/LinkButton";
import Loading from "../../LayOut/Loading";
import Pagination from "./Pagination";
import Message from "../../LayOut/Message";

function Usuario() {
  const [itens, setItens] = useState([]);
  const [itensPerPage, setItensPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [texto, setTexto] = useState("");
  const [removeLoading, setRemoveLoading] = useState(false);
  const [message, setMessage] = useState("");

  const pages = Math.ceil(itens.length / itensPerPage);
  const startIndex = currentPage * itensPerPage;
  const endIndex = startIndex + itensPerPage;
  const currentItens = itens.slice(startIndex, endIndex);

  const BaseUrl = texto
    ? `http://localhost:5000/users/name/${texto}`
    : "http://localhost:5000/users/";

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(BaseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
      })
        .then(async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            setItens(data);
            setRemoveLoading(true);
          } else {
            throw new Error(response.status + " Failed Fetch ");
          }
        })
        .catch((e) => console.error("EXCEPTION: ", e));
    };
    fetchData();
  }, [texto]);

  useEffect(() => {
    setCurrentPage(0);
  }, [itensPerPage]);

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setTexto(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    document.querySelector("#busca").value = "";
    setTexto(e.target.value);
    document.querySelector("#busca").focus();
  };

  return (
    itens.length > 0 && (
      <div className={Styles.LayOutForm}>
        {message && <Message type="success" msg={message} />}
        {!removeLoading && <Loading/>}
        <div className={Styles.LayOutForm}>
          <h2>Lista de Usuários</h2>
          <form
            className={Styles.formPesquisa}
            name="formPesquisa"
            id="formPesquisa"
          >
           <div className={Styles.divJunta}>
            Itens por Página:  
              <select
              value={itensPerPage}
              name="selectPesquisa"
              id="selectPesquisa"  
              onChange={(e) => setItensPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>            
            </div>
            <div className={Styles.divJunta}>
            <label htmlFor="busca">Pesquisar:</label>  
            <input
              type="text"
              name="busca"
              id="busca"
              onChange={handleChange}
            />  
            <button className={Styles.buttonEditar} onClick={handleClick}>
              Limpar
            </button>
            </div>
            <div className={Styles.divJunta}>
               <LinkButton to="/FrmNovoUsuario" text="Novo Usuário" setMessage={setMessage} />
            </div>
          </form>
        </div>

        <div className={Styles.divTable}>
          <table className={Styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Depto</th>
                <th>Cargo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentItens.map((item) => (
                <tr key={item.id}>
                  <td width="20%">{item.name}</td>
                  <td width="20%">{item.email}</td>
                  <td width="10%">{item.celphone}</td>
                  <td width="15%">{item.depto}</td>
                  <td width="15%">{item.cargo}</td>
                  <td  width="20%">
                    <button className={Styles.buttonEditar}>Editar</button>{" "}
                    <button className={Styles.buttonExcluir}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Pagination setCurrentPage={setCurrentPage} pages={pages} currentPage={currentPage} />
      </div>
    )
  );
}

export default Usuario;
