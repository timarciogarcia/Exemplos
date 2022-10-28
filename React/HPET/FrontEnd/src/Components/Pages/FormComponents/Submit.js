import styles from './Submit.module.css'

function Submit({ text }) {
 
  function voltar() {
    window.history.back();
  }
    return ( 
      <div className={styles.div}>
          <button className={styles.btn}>{text}</button>
          <button className={styles.btn} onClick={voltar}>Voltar</button>
      </div>
    );
  }
export default Submit;