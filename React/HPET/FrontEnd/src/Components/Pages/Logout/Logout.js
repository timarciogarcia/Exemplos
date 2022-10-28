import { useContext } from "react";
import { AuthContext } from "../../../Context/Auth";

function Logout() {
  const { logout } = useContext(AuthContext);
  logout();
}

export default Logout;
