const Sequelize = require("sequelize");
const db = require("../DataBase/db");

const User = db.define("rhusuarios", {
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    celphone: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cep:{
        type: Sequelize.STRING,
        allowNull: false
    },
    logradouro:{
        type: Sequelize.STRING,
        allowNull: false
    },
    numero:{
        type: Sequelize.STRING,
        allowNull: false
    },
    complemento:{
        type: Sequelize.STRING,
        allowNull: false
    },
    bairro:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cidade:{
        type: Sequelize.STRING,
        allowNull: false
    },
    uf:{
        type: Sequelize.STRING,
        allowNull: false
    },
    estado:{
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    rhcargo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'rhcargo',
            key: 'id'
        }        
    },
    rhdepartamento_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'rhdepartamento',
            key: 'id'
        }
    }
});

module.exports = User;