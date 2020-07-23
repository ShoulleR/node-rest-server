require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser'); //npm body-parser


//parse application/x - www - form - urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json()); //MIDDLEWARES : TODAS LAS PETICIONES PASARAN POR AQUI.

app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});


app.post('/usuario', function(req, res) {

    let body = req.body

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: "El nombre es necesario"
        }); // indicamos el status BAD REQUEST 400 para que el usuario que usa nuestra api tenga informacion.

    } else {

        res.json({
            persona: body
        });

    }

});

app.put('/usuario/:id', function(req, res) {

    let UsuarioId = req.params.id;

    res.json({
        UsuarioId //EN POCAS PALABRAS SE DICE QUE SE RETORNE COMO JSON LO QUE SE RECIBA DEL URL.
    });
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto: `, 8080);
});


// PETICIONES GET,POST,PUT,DELETE
//PUT SE USA PARA CUANDO QUEREMOS ACTUALIZAR DATA.
//POST ES MAS QUE TODO PARA CREAR NUEVOS REGISTROS.


//Normalmente en un POST no simplemente se hace una peticion. nosotros vamos a mandar una informacion.accordion
//POSTMAN NOTA : Body - x-wwww-form-urlencoded
//ponemos 2 keys con values