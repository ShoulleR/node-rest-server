//========================
//PUERTO
//======================

process.env.PORT = process.env.PORT || 8080;


//========================
//ENTORNO
//========================


process.env.NODE_ENV = process.env.NODE_ENV || 'dev' // esto es una variable que establece heroku, Si existe la variable estamos en produccion si no en desarollo.


//========================
//Caducidad del Token
//========================
//Queremos que dure 30 dias
//60 segundos * 60 minutos * 24horas * 30 dias

process.env.CADUCIDAD_TOKEN = '48h';



//========================
//SEED DE Autenticacion Token
//========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; // asi es para crear una variable de entorno en heroku para que no se vea la info secreta.



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



//========================
//GOOGLE CLIENTE ID
//========================


process.env.CLIENTE_ID = process.env.CLIENTE_ID || '1051457226069-n3e224jrasiv7u2qihepe4ks1n9bnrc0.apps.googleusercontent.com';