const{Router} = require("express")
const{User} = require("./model")
const{schemaJoiUser, schemaLogin} = require("./verif")
const {compare} = require("bcrypt")
const JWT = require("jsonwebtoken")

const route = Router()

//Fonctionne
route.post("/", async (request, response) => {
    const {body} = request;

    const {error} = schemaLogin.validate(body, {abortEarly : false})
    if(error) return response.status(400).json(error.details);

    const utilisateurRecherche = await User.findOne({email : body.email})
    if(!utilisateurRecherche) return response.status(404).json({msg : `Aucun profil avec cet identifiant`});

    const verif = await compare( body.password , utilisateurRecherche.password)
    if(!verif) return response.status(404).json({msg : `Aucun profil trouvé avec cet identifiant.`})

    const profilSansPassword = {
        _id : utilisateurRecherche._id,
        email : utilisateurRecherche.email,
        role : utilisateurRecherche.role ? utilisateurRecherche.role : "redacteur"
    }

    const token  = JWT.sign(profilSansPassword, process.env.JWT_SECRET);

    response.json({msg : "bienvenue" , token : token})
})

module.exports = route;
