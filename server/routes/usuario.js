// PETICIONES GET,POST,PUT,DELETE
//PUT SE USA PARA CUANDO QUEREMOS ACTUALIZAR DATA.
//POST ES MAS QUE TODO PARA CREAR NUEVOS REGISTROS.


//Normalmente en un POST no simplemente se hace una peticion. nosotros vamos a mandar una informacion.accordion
//POSTMAN NOTA : Body - x-wwww-form-urlencoded
//ponemos 2 keys con values

const express = require('express');
const bcrypt = require('bcrypt'); // npm bcrypt para encriptar password.
const _ = require('underscore'); // npm install underscore. //libreria de metodos ayudantes muy buena.
const Usuario = require('../models/usuario'); //<--importamos el modelo de schema.

const app = express();






app.get('/usuario', function(req, res) {



    let desde = req.query.desde || 0; // los parametros opcionales en /usuario caen dentro de un objeto query
    //para llamar parametros opcionales es /usuario?desde=10 se usa un simbolo "?var=value"
    //le decimos que si viene una variable llamada desde la use si no es 0.(se deberia validar si es un numero.)
    desde = Number(desde);

    let limite = req.query.limite || 5; // para hacer un doble parametro se por ejemplo /usuario?limite=10&desde=10
    limite = Number(limite); // se transforma a numero;



    Usuario.find({ estado: true }, 'nombre email role estado google img') //metodo de busqueda mongoose,  SE LE PUEDE ENVIAR PARAMETROS DE FILTRO POR EJEMPLO find({}, 'nombre email') 
        .skip(desde) // metodo que especifica el numero de documentos que va a saltar.
        .limit(limite) // metodo para filtrar el numero de busqueda
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }




            Usuario.count({ estado: true }, (err, conteo) => { //metodo de conteo mongoose,  SE LE PUEDE ENVIAR PARAMETROS DE FILTRO POR EJEMPLO {google:true,role: USER_ROLE}

                if (err) {
                    return res.json({
                        ok: false,
                        err
                    });
                }



                return res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo


                })

            })


        }) //este metodo es para ejecutar de mongoose
});


app.post('/usuario', function(req, res) {

    let body = req.body; //SABEMOS QUE AQUI ESTAMOS RECIBIENDO INFO DEL POST

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // se usa el HASH pero con sync para que sea asincrona, primer parametro es la clave, segundo parametro es el numero de vueltas que quiero aplicar este hash
        role: body.role
    });


    return usuario.save((err, usuarioDB) => { //<---SAVE ES UNA PALABRA RESERVADA DE MONGOOSE. //sirve para guardar a info en bd?
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        return res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', function(req, res) { //ENTIENDE POR PUT COMO ACTUALIZACION DE REGISTRO.

    let id = req.params.id; //el id es lo que viene despues del usuario/: en el PATH
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // se recibe info del postman. //se usa el metodo pick de underscore

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { // VERIFICAR ESTE METHOD EN MONGOOSE DOCS.

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let estado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, estado, { new: true, runValidators: true }, (err, usuarioDesactivado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioDesactivado) { // SI NO EXISTE EL USUARIO 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario No existe en Base de Datos'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDesactivado
        })

    });




});



module.exports = app; //OJO CON ESTA FORMA DE EXPORTAR. NO ES LO MISMO QUE EXPORTAR FUNCIONES QUE MIDDLEWARES AL PARECER.