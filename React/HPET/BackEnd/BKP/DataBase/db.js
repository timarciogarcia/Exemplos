const Sequelize = require('sequelize');

const DB_USER = process.env.DB_MYSQL_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_MYSQL_PASSWORD);
const DB_HOST = process.env.DB_MYSQL_HOST;
const DB_DATABASE = process.env.DB_MYSQL_DATABASE;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database conected");
  })
  .catch((err) => {
    console.log("Conecting database error " + err);
  });

module.exports = sequelize;