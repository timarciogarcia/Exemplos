import React, { useState, useContext } from "react";
import Styles from "./LayOutFormLogin.module.css";
import Loading from "../../LayOut/Loading";

import { AuthContext } from "../../../Context/Auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useContext(AuthContext);
  const [removeLoading, setRemoveLoading] = useState(false);

  function handleSubmit(event) {
    !removeLoading && Loading();
    event.preventDefault();
    login(email, password)
    setRemoveLoading(true);
  }

  return (    
    <div className={Styles.LayOutForm}>
      <form className={Styles.form} onSubmit={handleSubmit}>
        <h1 className={Styles.title}>Entrada</h1>
        <div className={Styles.field}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={Styles.field}>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={Styles.actions}>
          <button type="submit">Entrar</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
