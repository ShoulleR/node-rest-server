//=========================
//Verificar Token
//=========================

const jwt = require('jsonwebtoken');


let verificaToken = (req, res, next) => {

    let token = req.get('token'); // Esto es para conseguir los headers


    jwt.verify(token, process.env.SEED, (err, decoded) => { // esta funcion la trae jwt para verificar los tokens.

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'token invalido'
            })
        }

        req.usuario = decoded.usuario; // el decoded.usuario es el payload del token
        next(); //este next es para que siga con el programa 

    })



};


//=========================
//Verificar AdminRole
//=========================


let verificaAdmin_role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {

        return res.status(401).json({
            ok: false,
            err: 'Usuario no es administrador'
        });
    }

    next(); //este next es para que siga con el programa


}


//=========================
//Verifica token img // token por url
//=========================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => { // esta funcion la trae jwt para verificar los tokens.

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'token invalido'
            })
        }

        req.usuario = decoded.usuario; // el decoded.usuario es el payload del token
        next(); //este next es para que siga con el programa 

    });



}



module.exports = {
    verificaToken,
    verificaAdmin_role,
    verificaTokenImg
}