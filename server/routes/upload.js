const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path'); //para constuir el path
const app = express();




app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }


    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son: ' + tiposValidos.join(', ')
            }
        })
    }


    //El nombre del imput ejemplo "archivo".
    let archivo = req.files.archivo;



    //Extensiones Permitidas o Validas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1];


    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            message: 'Las extensiones Validas son : ' + extensionesValidas.join(', '),
            ext: extension
        })

    }


    //Cambiar nombre al archivo 

    let nombreArchivo = `${id}- ${new Date().getMilliseconds()}.${extension}` // con esto le cambiamos el nombre. los ID son uniques y 
        //le agregamos la fecha en milisegundos para el cache del navegador no diga que es la misma imagen y .extension






    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => { //este metodo se usa para decirle que guarde el archivo en el path seleccionado
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }


        //Aqui ya se subio la imagen
        if (tipo !== 'productos') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }



    });


});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarPath(nombreArchivo, 'usuarios'); // usamos esta funcion si da error para borrar la imagen que ya se subio
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borrarPath(nombreArchivo, 'usuarios'); // usamos esta funcion si da error para borrar la imagen que ya se subio
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })

        }

        //let pathImg = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`) //este metodo nos ayuda a crear el path mediante segmentos del mismo

        //if (fs.existsSync(pathImg)) { //funcion de fs que permite saber si existe el path o no devuelve true o false

        //    fs.unlinkSync(pathImg); // Funcion de fs que permite borrar el Path.(cuidado con esto.)

        //}

        borrarPath(usuarioDB.img, 'usuarios'); // aqui borramos la imagen que tiene el usuario en base de datos y agregamos la nueva



        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    });



}


function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borrarPath(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarPath(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }




        borrarPath(productoDB.img, 'productos'); // Aqui borramos la imagen anterior si llega a existir.


        productoDB.img = nombreArchivo; // aqui le decimos que la imagen nueva se almacene en el producto de la base de datos

        productoDB.save((err, productoGuardado) => { // Y Aqui guardamos el "Nuevo producto" Subiendo la imagen

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });


    });


}




function borrarPath(nombreImg, tipo) {

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`) //este metodo nos ayuda a crear el path mediante segmentos del mismo

    if (fs.existsSync(pathImg)) { //funcion de fs que permite saber si existe el path o no devuelve true o false

        fs.unlinkSync(pathImg); // Funcion de fs que permite borrar el Path.(cuidado con esto.)

    }


}






module.exports = app;