require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser'); //npm body-parser
const path = require('path'); // trae por defecto nodejs


//parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json()); //MIDDLEWARES : TODAS LAS PETICIONES PASARAN POR AQUI.


app.use(require('./routes/index')); //CONFIGURACION GLOBAL DE LAS RUTAS.
app.use(require('./routes/login'));



//habilitamos la carpeta public.
app.use(express.static(__dirname + '/public')); //ESTE METODO ARMA POR NOSOTROS LOS EL PATH ENVIANDO SEGMENTOS DEL PATH.






mongoose.connect(process.env.URLDB, { //<--ACA NOS CONECTAMOS A MONGODB, USANDO MONGOOSE DE NPM METODO CONNECT VERIFICAR DOC.
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true //<--- ESTO VIENE DEFINIDO DESDE NPM MONGOOSE PARA CONECTAR.
    }).then((resp) => console.log('Base de Datos Online'))
    .catch((err) => console.log('No se Conecto a la Base de Datos', err)) // <--controlamos el si es posible error funcion de felcha.



app.listen(process.env.PORT, () => { //<--- process.env.PORT ES PARA QUE EL PUERTO LO RECONOZCA SOLO. 
    console.log(`Escuchando el puerto: `, 8080);
});