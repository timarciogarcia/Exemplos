import { Navigate, Route, Routes } from "react-router-dom";
import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "../../Context/Auth";

import Login from "../Pages/Login/Login";
import Home from "../Pages/Home/Home";
import Contato from "../Pages/Contato/Contato";
import Empresa from '../Pages/Empresa/Empresa';
import Administracao from "../Pages/Administracao/Administracao";
import Logout from "../Pages/Logout/Logout";
import CtasaPagar from "../Pages/CtasaPagar/CtasaPagar";
import CadMenu from "../Pages/CadMenu/CadMenu";
import Usuario from "../Pages/Usuario/ListUsuario";
import FrmNovoUsuario from "../Pages/Usuario/FrmNovoUsuario";

function MyRoute() {
        function Private({ children }) {
          const { authenticated, loading } = useContext(AuthContext);
          const { logout } = useContext(AuthContext);
          if (loading) return <div>Carregando...</div>;
          if (!authenticated) {
            console.log("nao autenticado");
            logout();
            return <Navigate to="/login" />;
          }
          if (!localStorage.getItem("user")) {
            console.log("Sem user, nao autenticado");
            logout();
            return <Navigate to="/login" />;
          }
          if (!localStorage.getItem("token") || localStorage.getItem("token") === "") {
            logout();
            return <Navigate to="/login" />; 
          }

          if (!MostraElementos(window.location.pathname)) {
            logout();
            return <Navigate to="/login" />;                         
          }
          return children;
        }

        function MostraElementos(path){
          let VarElementos = JSON.parse(localStorage.getItem("elementos"));
          if(path ==="/login" || path ==="/logout" || path ==="/"){
            return true;
          }
          for(let i = 0; i < VarElementos.length; i++){
            if ("/"+VarElementos[i].Ele === path){
              return true;
            }
          }
          return false;
        }

  return (
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  exact
                  path="/"
                  element={
                    <Private>
                      <Home />
                    </Private>
                  } 
                />
                <Route
                  path="/contato"
                  element={
                    <Private>
                      <Contato />
                    </Private>
                  }
                />
                <Route
                  path="/empresa"
                  element={
                    <Private>
                      <Empresa />
                    </Private>
                  }
                />
                <Route
                  path="/administracao"
                  element={
                    <Private>
                      <Administracao />
                    </Private>
                  }
                />
                <Route
                  path="/CtasaPagar"
                  element={
                    <Private>
                      <CtasaPagar />
                    </Private>
                  }
                />
                <Route path="/logout" element={<Private><Logout   /></Private>} />
                <Route path="/cadmenu" element={<Private><CadMenu /></Private>} />
                <Route path="/usuario" element={<Private><Usuario /></Private>} />
                <Route path="/FrmNovoUsuario" element={<FrmNovoUsuario />} />

              </Routes>
            </AuthProvider>
            
          );
}
export default MyRoute;

/*  // AINDA SERA DESENVOLVIDO A LOGICA DOS ROUTES AUTOMARICOS
    //montando a rota pelo jason do menu
    ( localStorage.getItem(tpMenu) && 
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route exact path="/" element={<Private><Home /></Private>}/>
          {
            var1.map((item) => 
                      item.sub.map((sub) => 
                        <Route path={'/'+sub.Path} element={<Private><Administracao /></Private>} />
                        //`<Route path="/"+${sub.Path} element=<Private><${sub.Element}/></Private> />`
                      )                      
            )
          }
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </AuthProvider>
    )
*/

/*
    <AuthProvider>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        exact
        path="/"
        element={
          <Private>
            <Home />
          </Private>
        } 
      />
      <Route
        path="/contato"
        element={
          <Private>
            <Contato />
          </Private>
        }
      />
      <Route
        path="/empresa"
        element={
          <Private>
            <Empresa />
          </Private>
        }
      />
      <Route
        path="/administracao"
        element={
          <Private>
            <Administracao />
          </Private>
        }
      />
      <Route
        path="/logout"
        element={
          <Private>
            <Logout />
          </Private>
        }
      />
    </Routes>
  </AuthProvider>

*/