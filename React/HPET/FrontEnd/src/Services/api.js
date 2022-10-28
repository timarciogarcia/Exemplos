import axios from "axios";
import { Navigate } from "react-router-dom";

export const api = axios.create();

export const createSession = async (email, password) => {

  const user = await api.post( 
    'http://localhost:5000/users/login',
    { email, password }    
  )
  if(user.data.error) {
    Navigate('/login')
    return { error: user.data.error }
  }
  if(user.data.token) {
      localStorage.setItem('token', user.data.token)
      localStorage.setItem("user_id", user.data.user.id);
      localStorage.setItem("user", user.data.user.email);
      localStorage.setItem("id", user.data.user.id);
      localStorage.setItem("name", user.data.user.name);
      localStorage.setItem("email", user.data.user.email);
  }

  //Api para guardar o ususari na tabela rhsession
  const rhsession = await api.post(
    'http://localhost:5000/users/session',
    {user_id: user.data.user.id, email: user.data.user.email,token: user.data.token},
    {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-access-token": localStorage.getItem("token")
      },
    }
  )

  const menuDB = await api.post("http://localhost:5000/users/menu", { email },
  {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-access-token": localStorage.getItem("token")
    },
  });
  if (menuDB.data.error) {
    return { error: menuDB.data.error };
  } else {
    localStorage.setItem("menu", menuDB.data.menu);
  }
  
  if (menuDB.data.length > 0) {
    var menu = menuDB.data;
    if (menu.length > 0) {
      var a = 0;
      var MenuTop = "";
      var JsonGrande = "[";
      var JsonFilhos = "";
      var Elementos = "[" ;
      while (a < menu.length) {
        MenuTop = menu[a].nomemenu;
        if (a < menu.length - 1) {
          MenuTop = menu[a].nomemenu;
          if (MenuTop === menu[a + 1].nomemenu) {
            MenuTop = menu[a].nomemenu;
                JsonFilhos +=
                '{"Path":"'    + menu[a].nomelinkpath + '",' +
                '"Menu" :"'    + menu[a].nomesubmenu  + '",' +
                '"Ele":"'  + menu[a].nomeelement  + '"},';
                
                Elementos += '{"Ele":"'  + menu[a].nomelinkpath  + '"},';

          } else {
            MenuTop = menu[a].nomemenu;
                JsonFilhos +=
                '{"Path":"'    + menu[a].nomelinkpath + '",' +
                '"Menu" :"'    + menu[a].nomesubmenu  + '",' +
                '"Ele":"'  + menu[a].nomeelement  + '"}';
                
                Elementos += '{"Ele":"'  + menu[a].nomelinkpath  + '"},';

            JsonGrande += '{"Menutop":"' + MenuTop + '","sub" : [' + JsonFilhos + "]},";
            JsonFilhos = "";
          }
        } else {
          MenuTop = menu[a].nomemenu;
          JsonFilhos +=
          '{"Path":"'    + menu[a].nomelinkpath + '",' +
          '"Menu" :"'    + menu[a].nomesubmenu  + '",' +
          '"Ele":"'  + menu[a].nomeelement  + '"}';

          Elementos += '{"Ele":"'  + menu[a].nomelinkpath  + '"}';

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
  Elementos+= "]";
  var objeto1 = JSON.parse(menupadrao);
  localStorage.setItem("menupadrao", JSON.stringify(objeto1));  

  var Elementos1= Elementos;
  localStorage.setItem("elementos", Elementos1);

  return await user.data;

};
