import Container from "../Container";
import styles from "./Navbar.module.css";
import { FaHospitalSymbol } from "react-icons/fa";
import { Link } from "react-router-dom";
  

function NavBarApi() {

  if( !localStorage.getItem("menupadrao" )) {
    var menupadrao = '[{"Menutop":"Faça o Login para entrar no Sistema","sub":[]}]';  
    var objeto1 = JSON.parse(menupadrao);
    localStorage.setItem("menupadrao", JSON.stringify(objeto1)); 
  }
  var tpMenu=""
  localStorage.getItem("user") ? (tpMenu = "menu") : (tpMenu = "menupadrao");
  const var1 = JSON.parse(localStorage.getItem(tpMenu));
  return (
    ( tpMenu !== "" &&
      <nav className={styles.menu}>
        <Container>
          <Link to="/" className={styles.sociallist}>
            <FaHospitalSymbol />
            Pet
          </Link>
          <ul className={styles.list}>
              {
              var1.map((item) => 
              ( 
                  <li key={item.Menutop} className={styles.item}>
                    <Link to={"/"}>{item.Menutop}</Link>
                      <ul className={styles.list}>
                        {
                        item.sub.map((sub) => 
                        (
                          <li key={sub.Menu} className={styles.item}>
                            <Link to={sub.Path}>{sub.Menu}</Link>
                          </li>
                        ))
                        }
                      </ul>
                  </li>
              ))
              }
              {localStorage.getItem("user") && (
              <li key="sair" className={styles.item}>
                <Link to="/logout">Sair</Link>
              </li>
              )}
          </ul>
        </Container>
      </nav>      
  ));
}

export default NavBarApi;

