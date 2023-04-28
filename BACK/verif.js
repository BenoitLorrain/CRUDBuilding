const Joi = require("joi").extend(require('@joi/date'));
// const ImageExtension = require('joi-image-extension')


const schemaBuildingJoi = Joi.object({
    title: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(1).max(10000),
    picture: Joi.string().required(),
    author: Joi.string().min(1).max(255).required(),
    dt_creation: Joi.date().format('DD-MM-YYYY').required()
})

const schemaJoiUser = Joi.object({
    email : Joi.string().email({ tlds: { allow: false } }).required(),
    password : Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required(),
    role : Joi.string().valid("redacteur","admin").required()
})

const schemaLogin = Joi.object({
    email : Joi.string().min(1).max(255).email({ tlds: { allow: false } }).required(),
    password : Joi.string().min(8).max(255).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).required(),
});


module.exports.schemaBuildingJoi = schemaBuildingJoi;
module.exports.schemaJoiUser = schemaJoiUser;
module.exports.schemaLogin = schemaLogin;