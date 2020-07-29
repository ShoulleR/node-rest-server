//========================
//PUERTO
//======================

process.env.PORT = process.env.PORT || 8080;


//========================
//ENTORNO
//======================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev' // esto es una variable que establece heroku, Si existe la variable estamos en produccion si no en desarollo.


//========================
//BASE DE DATOS
//======================


let urlDB;

if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;