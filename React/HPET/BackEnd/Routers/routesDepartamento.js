const routerDepartamento = require("express").Router();
const sequelize = require("../DataBase/db");
//const departamento = require("../Models/rhDepartamento");

//importa do arquivo userRoutes a funcao verifyToken
const { verifyToken } = require("../Routers/userRoutes");

// Api Get que busca rodos os dados do Departamento
routerDepartamento.get("/", async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const departamentos = await sequelize.query(
            "SELECT * FROM hpet.rhdepartamento "
        , {transaction});
        if (!departamentos || departamentos.length === 0) {
        res.status(404).send({ error: "Registro não encontrado, verifique !!!" });
        await transaction.rollback();
        return;
        }
        //console.log(departamentos);
        //res.send(departamentos);
        await transaction.commit();
        return res.send(departamentos);
    } catch (err) {
        res.send({ error: err.message });
        if (transaction) await transaction.rollback();
    }
    });

module.exports = routerDepartamento;