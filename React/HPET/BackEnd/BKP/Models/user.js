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
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
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