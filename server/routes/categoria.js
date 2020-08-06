const express = require('express');

let { verificaToken, verificaAdmin_role } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');


let app = express();





//==================================
//ESTE GET VA A MOSTRAR TODAS LAS CATEGORIAS
//==================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion') //ordena por la descripcion
        .populate('usuario', 'nombre email') //El populate va a revisar que object id existen en la categoria que estoy solicitando y me va a permitir cargar informacion. 
        .exec((err, categoriaDB) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                })


            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })



        })

});




//==================================
//ESTE GET VA A MOSTRAR LA CATEGORIA POR ID
//==================================

app.get('/categoria/:id', verificaToken, async(req, res) => {

    let id = req.params.id; //tomamos el ID del Path

    await Categoria.findById(id).exec((err, categoriaDB) => {
        if (err) {
            res.json({
                err
            })
        }
        res.json({
            categoria: categoriaDB
        })
    });

});


//==================================
//Este Post va a Crear una nueva Categoria
//==================================

app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id 
    let body = req.body;

    let usuario = req.usuario


    let categoria = new Categoria({

        descripcion: body.descripcion,
        usuario

    });



    return categoria.save((err, categoriaDB) => {

        if (err) {

            res.status(500).json({
                ok: false,
                err

            });
        }

        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            })

        }
        res.json({
            ok: true,
            categoria: categoriaDB,
        })

    });


});


//==================================
//Actualizar la Categoria
//==================================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let descripcion = req.body.descripcion;


    Categoria.findByIdAndUpdate(id, { descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }



        res.json({
            categoria: categoriaDB
        })



    })

});


//==================================
//Borrar la categoria
//==================================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_role], (req, res) => { //todas necesitan un token valido

    //solo un administrador puede borrar categorias
    //Categoria.findByIdAndRemove()

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {

            res.status(400).json({
                ok: false,
                err
            })

        }

        if (!categoriaBorrada) {
            return res.json({
                message: 'El id no existe en la base de datos'

            })

        } else {

            return res.json({
                categoria: categoriaBorrada
            })
        }

    })

});




module.exports = app;