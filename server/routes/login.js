const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {


    let body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

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
























module.exports = app;