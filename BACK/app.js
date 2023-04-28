const express = require("express")
const routeUser = require("./route-user")
const routeConnexion = require("./route-connexion")
const routeBuilding = require("./route-building")
//const routeConnexion = require("./route-connexion")
const {connect} = require("mongoose")
require("dotenv").config();

const URI = process.env.NODE_ENV === "production" ? process.env.BDD_PROD : process.env.BDD_DEV

connect(URI)
    .then(() => console.log("Connexion à MongoDB réussie"))
    .catch((ex) => console.log(ex))

const PORT = 4003;

const app = express()

app.use(express.json());

app.use("/user",routeUser)
app.use("/login", routeConnexion)
app.use(routeBuilding)


app.listen(PORT , () => console.log(`express start sur port ${PORT}`));