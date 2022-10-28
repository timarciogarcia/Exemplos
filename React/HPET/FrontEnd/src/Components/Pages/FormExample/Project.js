import styles from "./Project.module.css";
import Loading from "../layout/Loading";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "../layout/Container";
import ProjectForm from "../project/ProjectForm";
import { useNavigate } from "react-router-dom";
import Message from "../layout/Message";

function Project() {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const url = `http://localhost:5000/projects/${id}`;
  const [tempo, setTempo] = useState(500);
  const [showProjectForm, setShowProjectForm] = useState();
  const [showServiceForm, setShowServiceForm] = useState();
  const [Message, setMessage] = useState(false);
  const [type, setType] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setProject(data))
        .then(() => console.log("Project", project))
        .then(() => {
          project.name ? setTempo(0) : setTempo(500);
        })
        .catch((err) => {
          return console.log(err);
        });
    }, tempo);
  }, [id]);

  function editPost(project) {
    if (project.budget < project.costs) {
      navigate("/projects", {
        state: { message: "O orçamento não pode ser menor que o custo" },
      });

      return false;
    }
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        toggleProjectForm();
        navigate("/projects", {
          state: { message: "Projeto alterado com sucesso!" },
        });
      })
      .catch((err) => console.log(err));
  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            <div className={styles.details_container}>
              <h1>Projeto: {project.name}</h1>
              <button className={styles.btn} onClick={toggleProjectForm}>
                {showProjectForm ? "Editar Formulário" : "Fechar Formulário"}
              </button>
              {showProjectForm ? (
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria:</span> {project.category.name}
                  </p>
                  <p>
                    <span>Vlr Orçamento:</span> R${project.budget}
                  </p>
                  <p>
                    <span>Vlr Utilizado:</span> R${project.costs}
                  </p>
                </div>
              ) : (
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir Edição"
                    projectData={project}
                  />
                </div>
              )}
            </div>

            <div className={styles.details_form_container}>
              <h2>Adicione um Serviço</h2>
              <button className={styles.btn} onClick={toggleServiceForm}>
                {showServiceForm ? "Adicionar Serviço" : "Fechar Formulário"}
              </button>
              <div className={styles.project_info}>
                {!showServiceForm && <div>Formulário do Serviço</div>}
              </div>
            </div>

            <h2>Lista de Serviços</h2>
            <Container customClass="start">
              <p>Itens do Serviço</p>
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Project;
