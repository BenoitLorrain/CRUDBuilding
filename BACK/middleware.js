const JWT = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")
const {schemaBuildingJoi} = require("./verif");


function autorisation(request, response, next){
    const token = request.header("x-token")
    if(!token) return response.status(401).json({msg : "Vous devez avoir un token JWT pour réaliser cette opération."})

    try{
        const payload = JWT.verify(token, process.env.JWT_SECRET)
        request.user = payload
        next();
    }
    catch(ex){
        response.status(400).json({msg : "JWT invalide"})
    }
}

function idValid(request, response, next){
    const id = request.params.id
    if(!isValidObjectId(id)) return response.status(400).json({msg : `L'id ${id} n'est pas valide pour MongoDB.`, where : "middleware"})
    next();
}

function idValidBuilding(request, response, next){
    const {body} = request;
    const {error} = schemaBuildingJoi.validate(body , { abortEarly : false})
    if(error) return response.status(400).json(error.details)
    next();
}



module.exports.autorisation = autorisation;
module.exports.idValid = idValid;
module.exports.idValidBuilding = idValidBuilding;