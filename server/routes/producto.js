const express = require('express');

const { verificaToken, verificaAdmin_role } = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

const Producto = require('../models/producto');




//=================================
//Buscar Productos
//=================================

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino; //PARA UNA BUSQUEDA EXACTA SE USA EL NOMBRE TAL CUAL COMO ESTA GUARDADO.

    let regex = new RegExp(termino, 'i'); //se usa expresion regular para decirle que ignore case a termino




    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                producto: productoDB
            })


        });


});



















//=================================
//Obtener los Productos
//=================================

app.get('/producto/:desde', verificaToken, (req, res) => {
    //trade todos los productos
    //populate: usuario y categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true }, 'nombre precioUni')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) { return res.status(500).json({ ok: false, err }) }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el producto'
                    }
                })
            }

            return res.json({

                producto: productoDB
            })

        });





});




//=================================
//Obtener los Productos por id
//=================================

app.get('/producto/:id', verificaToken, (req, res) => {
    //trade todos los productos por id
    //populate: usuario y categoria

    let id = req.params.id

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.json({
                    ok: false,
                    err
                })
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Id Invalido'
                    }
                })
            }

            return res.json({
                producto: productoDB
            })


        });





});


//=================================
//Crear un nuevo Producto
//=================================

app.post('/producto', verificaToken, (req, res) => {

    //grabar el usuario
    //grabar una categoria del listado

    let usuario = req.usuario;
    let body = req.body;



    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        usuario,
        categoria: body.categoria
    });

    return producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({ ok: false, err });

        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'El producto que intenta guardar no existe' }
            });

        }

        res.json({
            producto: productoDB
        });


    });

});


//=================================
//Actualizar un producto
//=================================

app.put('/producto/:id', (req, res) => {
    //se puede actualizar usuario y categoria?

    let id = req.params.id; //el id es lo que viene despues del usuario/: en el PATH
    let body = _.pick(req.body, ['nombre', 'precioUni', 'usuario', 'categoria', 'descripcion', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoActualizado) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                err

            });
        }

        return res.json({
            producto: productoActualizado,
            message: 'Producto Actualizado'
        });





    });




});




//=================================
//Eliminar producto 
//=================================

app.delete('/producto/:id', [verificaToken, verificaAdmin_role], (req, res) => {
    //cambiar disponible pase a false

    let id = req.params.id; //el id es lo que viene despues del usuario/: en el PATH
    let disponible = req.body.disponible

    Producto.findByIdAndUpdate(id, { disponible }, { new: true, runValidators: true }, (err, productoDeshabilitado) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                err

            });
        }


        return res.json({
            producto: productoDeshabilitado,
            message: 'Producto Deshabilitado'
        });








    });

});


module.exports = app;