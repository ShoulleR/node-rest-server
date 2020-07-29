//ESTE ARCHIVO SE VA A ENCARGAR 
//DE TRABAJAR EL MODELO DE DATOS


const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //ESTO LO DESCARGAMOS DE NPM MONGOOSE-UNIQUE-VALIDATOR



let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} es un rol invalido.' // {VALUE} reconoce lo que ingresa el usuario. 
}


let Schema = mongoose.Schema;
//OBTENER EL ESQUEMA(CASCARON) PARA CREAR ESQUEMAS DE MONGOOSE, PORQUE DE AQUI VAMOS A CREAR VARIOS OBJETOS.



//DEFINIR NUESTRO ESQUEMA
let usuarioSchema = new Schema({
    nombre: { /*SE DEFINEN LAS REGLAS Y CONTROLES QUE ESTE USUARIOSCHEMA VA A TENER, ES DECIR LOS CAMPOS QUE VA A TENER LA COLECCION.*/
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true, // ESTE ATRIBUTO ES PARA DECIRLE QUE EL EMAIL SEA UNICO.
        reqired: [true, 'El correo es necesario']

    },
    password: {
        type: String,
        required: [true, 'la contraseña es obligatoria']

    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos //Enum es un módulo de JavaScript que introduce el tipo de enumeración. ESTE ENUM, SE ENCARGA DE VERIFICAR EL VALUE QUE PASO EL USUARIO A VER SI ESTA EN ROLES VALIDOS.
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


usuarioSchema.methods.toJSON = function() { // methods proviene de mongoose.Schema: ESTA VERGA NO LA ENTENDI, AL PARECER TOMAMOS EL OBJETO Y LE BORRAMOS EL PASSWORD PARA PODER IMPRIMIRLO.

        let user = this; //lo que sea que tenga este objeto en el momento.
        let userOBject = user.toObject(); //tomamos el objeto de ese usuario. de esta manera tenemos todas las propiedades y metodos.
        delete userOBject.password; //borramos el password.

        return userOBject; // y devolvemos el "Schema con el password borrado"
    }
    //EL METODO TOJSON EN UN SCHEMA SE LLAMA CUANDO SE INTENTA IMPRIMIR


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya esta en uso' }); // ACA USAMOS EL METODO .PUGLIN PARA DECIRLE AL SCHEMA QUE USE EL VALIDADOR.active   
// {PATH} MONGOOSE VA A INYECTAR EL MENSAJE DE ERROR AUTOMATICAMENTE.



module.exports = mongoose.model('Usuario', usuarioSchema);
//OJO ESTA EXPORTACION 
// REVISAR PORQUE? , PARA LOS SCHEMAS DE MONGOOSE APLICAR ESTA FORMA.