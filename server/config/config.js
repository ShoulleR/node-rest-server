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

//if (process.env.NODE_ENV === 'dev') {
//
//urlDB = 'mongodb://localhost:27017/cafe';
//}    else {
urlDB = 'mongodb+srv://shouller:xKOWvXDCSKQGFtvM@cluster0.v9a0i.mongodb.net/cafe?retryWrites=true&w=majority';
//}


process.env.URLDB = urlDB;