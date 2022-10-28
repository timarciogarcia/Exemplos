const routerCargo = require("express").Router();
const sequelize = require("../DataBase/db");
const cargo = require("../Models/rhCargo");

//importa do arquivo userRoutes a funcao verifyToken
const verifyToken = require("../Routers/userRoutes");

// Api Get que busca rodos os dados do cargo
routerCargo.get("/", async (req, res) => {
  try {
    const cargos = await sequelize.query(
        "SELECT * FROM hpet.rhcargo "
    ); 
    if (!cargos || cargos.length === 0) {
      res.status(404).send({ error: "Registro não encontrado, verifique !!!" });
      return;
    }
    console.log(cargos);
    res.send(cargos);
    return;
  } catch (err) {
    res.send({ error: err.message });
  }
});

module.exports = routerCargo;
