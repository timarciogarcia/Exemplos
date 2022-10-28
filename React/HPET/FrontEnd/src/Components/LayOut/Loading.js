import styles from "./Loading.module.css";
import loading from "../../Img/Double Ring-1s-200px.svg";

function Loading() {
  return (
    <>
      <div className={styles.loading_container}>
        <p className={styles.loader_text}>
          Aguarde Configurando... 
          <img className={styles.loader} src={loading} alt="loading" /></p>
      </div>
    </>
  );
}

export default Loading;
