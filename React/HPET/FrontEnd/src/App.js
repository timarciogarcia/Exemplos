import React from "react";
import MyRoute from "./Components/LayOut/MyRoute";
import { BrowserRouter as Router } from "react-router-dom";
import NavBarApi from "./Components/LayOut/NavBar/NavBarApi";

function App() {
  return (
    <Router>
      <NavBarApi />
      <MyRoute />
    </Router>
  );
}
export default App;
