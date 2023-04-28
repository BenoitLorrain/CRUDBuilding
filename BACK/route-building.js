const {Router} = require("express")
const {Building} = require("./model")
const {schemaBuildingJoi} = require("./verif")
const { isValidObjectId } = require("mongoose")
// const multer = require("multer")

const {autorisation, idValid, idValidBuilding} = require("./middleware")

const route = Router();



// Fonctionne
/*
{
  "title": "Tour Thiers",
  "description" : "C'est une tour à Nancy",
  "picture" : "https://files.structurae.net/files/photos/5256/2017-07-25/dsc01700.jpg" ,
  "author" : "a@yahoo.fr",
  "dt_creation" : "26-04-2023"
}
*/
route.post("/", autorisation, async function(request, response){
    const { body } = request;
    const userId = request.user._id;

    const newBuilding = new Building({...body, author : userId})
    await newBuilding.save();
    response.json({msg : `Le building a bien été ajouté.`});
})



// Fonctionne
route.get("/all", async (request, response) => {
    const tousLesBuildings = await Building.find().populate('author', 'email -_id role')
    response.json(tousLesBuildings);
})




// Fonctionne
route.delete("/:id",  [idValid, autorisation], async (request, response) => {
    const id = request.params.id;
    const responseMongo = await Building.findByIdAndRemove(id)
    if(!responseMongo) return response.status(404).json({msg : `Le building à l'id n°${id} n'existe pas.`})
    response.json({msg : `Le building à l'id n°${id} est bien suprimmé.`});
})




// Fonctionne
route.get("/:id", [idValid], async (request, response) => {
    const id = request.params.id;
    const buildingResearch = await Building.findById(id);
    if(!buildingResearch) return response.status(404).json({ msg : `Le building à l'id n°${id} n'existe pas.`})
    response.json(buildingResearch);
})



//Fonctionne avec la structure suivante
/*
{
    "title": "Tour Thiers",
    "description": "C'est une tour à Berlin",
    "picture": "https://files.structurae.net/files/photos/5256/2017-07-25/dsc01700.jpg",
    "author" : "6446987c4ed867bd0873634e",
    "dt_creation" : "26-04-2023"
  }
*/
route.put("/:id" , [idValid, idValidBuilding], async (request , reponse) => {
    const id = request.params.id ; 
    const { body } = request ;

    const {error} = schemaBuildingJoi.validate(body , { abortEarly : false})
    if(error) return  reponse.status(400).json(error.details) // 400 Bad Request

    const buildingUpdated = await Building.findByIdAndUpdate(id , { $set : body } , { new : true})
    if(!buildingUpdated) return reponse.status(404).json({ msg : `Le building à l'id n°${id} n'existe pas.` }) ; 
    reponse.json(buildingUpdated)
})


module.exports = route ;