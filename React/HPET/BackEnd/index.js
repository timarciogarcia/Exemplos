require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const routes = require('./Routers/userRoutes');  
const routesCargo = require('./Routers/routesCargo');
const routesDepartamento = require('./Routers/routesDepartamento');


//Transformar formato de ler para json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Politica de cors
const cors = require('cors');
const corsOptions ={
    origin: '*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200    
}
app.use(cors(corsOptions));

//Importa o arquivo de rotas
app.use('/users', routes);
app.use('/cargos', routesCargo);
app.use('/departamentos', routesDepartamento);

// Sistema escutando na porta
app.listen(process.env.PORT, () => {
    console.log("Server started");
});