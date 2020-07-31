const express = require('express');
const app = express();

//===============================================
//======ARCHIVO PARA CONFIGURAR LAS RUTAS========
//===============================================


app.use(require('./usuario'));
app.use(require('./login'));














module.exports = app;