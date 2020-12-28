const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTE_ID);



const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {


    let body = req.body;
    console.log(body);


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
		console.log(body);
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: '(Usuario) o Contraseña Incorrectos.'
            })

        }




        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { //<-- Va a regresar un true o un false para identificar si la contraseñas encryptadas hacen Macth.

            return res.status(400).json({
                ok: false,
                err: 'Usuario o (Contraseña) Incorrectos.'
            })

        }

        let token = jwt.sign({
                usuario: usuarioDB // esto es el payload lo que queremos guardar como token.
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) // 'Secret', {Duracion del token}


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });

});




//CONFIGURACIONES DE GOOGLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTE_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload(); // metodo para tomar el payload

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
};



app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({ eror: e })
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El correo no es de google, debe usar su autenticacion normal'
                    }
                })

            } else { // si pasa la autenticacion de google, creamos un token personalizado.

                let token = jwt.sign({
                        usuario: usuarioDB // esto es el payload lo que queremos guardar como token.
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) // 'Secret', {Duracion del token}

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }





        } else {

            //Si el usuario no esta en nuestra base de datos, significa que es un nuevo usuario pero con la validacion de google true.

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.password = ':)'; //USAMOS ESTE PASSWORD PORQUE NECESITAMOS PASAR LAS VALIDACIONES DE NUESTRO SCHEMA. NUNCA PODRA LOGEARSE CON UNA CARITA FELIZ. 
            usuario.google = true;


            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }



                let token = jwt.sign({
                        usuario: usuarioDB // esto es el payload lo que queremos guardar como token.
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) // 'Secret', {Duracion del token}

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });



            });





        }



    });

});






module.exports = app;