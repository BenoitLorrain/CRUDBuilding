const {Router} = require("express");
const {User} = require("./model")
const {schemaJoiUser} = require("./verif")
const { genSalt, hash} = require("bcrypt")
const {isValidObjectId} = require("mongoose")

const route = Router();



//Fonctionne avec le structure suivante
/*
{
    "email" : "c@yahoo.fr",
    "password" : "Azertyuiop123",
    "role" : "redacteur"
}
*/
route.post("/", async (request, response) => {
    const { body } = request

    const {error} = schemaJoiUser.validate(body , {abortEarly : false})
    if(error) return response.status(400).json(error.details)

    const userRecherche = await User.find({email : body.email})
    if(userRecherche > 0) return response.status(400).json({ msg : "L'adresse email a déjà été prise."});

    const salt = await genSalt(10)
    const passwordHashe = await hash(body.password , salt)

    const userACreer = new User ({ ...body, password : passwordHashe})
    await userACreer.save()
    response.json({ msg : "Le profil utilisateur a été créé"})
})



//Fonctionne
route.delete("/:id", async (request, response) => {
    const id = request.params.id;
    if(!isValidObjectId(id)) return response.status(400).json({ msg : `L'id ${id} n'est valide pour MongoDB.`})

    const profilASupprimer = await User.findByIdAndRemove(id)
    if(!profilASupprimer) return response.status(404).json({msg : `L'utilisateur à l'id ${id} n'existe pas.`})

    response.json({msg : `L'utilisateur à l'id ${id} est bien supprimé.`})
})



//Fonctionne
route.get("/all", async (request,response) => {
    const allUsers = await User.find({}).select({_id : 1 , email : 1})
    response.json(allUsers);
})

module.exports = route;