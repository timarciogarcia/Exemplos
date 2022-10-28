import axios from "axios";
import { Navigate } from "react-router-dom";

export const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  },
});

//TODO
// Proximo passo
// mudar para post e trazer o token jwt junto
export const createSession = async (email, password) => {

  const userDB = await api.get(`http://localhost:5000/users?email=${email}`);
  if (userDB.data.length <= 0) {
    Navigate("/logout");
    return { error: "Retornando" };
  }
  localStorage.setItem("user_id", userDB.data[0].id);
  localStorage.setItem("user", JSON.stringify(userDB.data[0].email));
  localStorage.setItem("id", userDB.data[0].id);

  // FAZ POST PARA BUSCAR O TOKEN JWT E RETORNAR JSON COM O TOKEN
  const user = await api.post( 
    `http://localhost:5000/users/login`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      },
    }
  )
  localStorage.setItem("token", user.data.token);
  console.log(user.data.token);
  
  const menuDB = await api.post("http://localhost:5000/users/menu", {
    email
  });
  if (menuDB.data.length > 0) {
    var menu = menuDB.data;
    if (menu.length > 0) {
      var a = 0;
      var MenuTop = "";
      var JsonGrande = "[";
      var JsonFilhos = "";
      while (a < menu.length) {
        MenuTop = menu[a].nomemenu;
        if (a < menu.length - 1) {
          MenuTop = menu[a].nomemenu;
          if (MenuTop === menu[a + 1].nomemenu) {
            MenuTop = menu[a].nomemenu;
                JsonFilhos +=
                '{"Path":"' +
                menu[a].nomelinkpath +
                '",' +
                '"Menu":"' +
                menu[a].nomesubmenu +
                '"},';
          } else {
            JsonFilhos +=
              '{"Path":"' +
              menu[a].nomelinkpath +
              '",' +
              '"Menu":"' +
              menu[a].nomesubmenu +
              '"}';
            JsonGrande += '{"Menutop":"' + MenuTop + '","sub" : [' + JsonFilhos + "]},";
            JsonFilhos = "";
          }
        } else {
          JsonFilhos +=
            '{"Path":"' +
            menu[a].nomelinkpath +
            '",' +
            '"Menu":"' +
            menu[a].nomesubmenu +
            '"}';
            JsonGrande += '{"Menutop":"' + MenuTop + '","sub" : [' + JsonFilhos + "]}]";
          var objeto = JSON.parse(JsonGrande);
          localStorage.setItem("menu", JSON.stringify(objeto));  
          JsonFilhos = "";
        }
        a++;
      }
    }
  }
  var menupadrao = '[{"Menutop":"Faça o Login para entrar no Sistema","sub":[]}]';  
  var objeto1 = JSON.parse(menupadrao);
  localStorage.setItem("menupadrao", JSON.stringify(objeto1));  

  return await userDB.data[0];

};
