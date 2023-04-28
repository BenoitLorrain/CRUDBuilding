const { Schema, model, Types } = require("mongoose")
const moment = require("moment")

const buildingSchema = new Schema({
    title : String,
    description : String,
    picture : String,
    author : {type : Types.ObjectId, ref : "users"},
    dt_creation : String
});

const Building = model("buildings", buildingSchema);


const userSchema = new Schema({
    email : String,
    password : String,
    role : { type : String, enum : ['redacteur', 'admin']}
})

const User = model("users", userSchema);

module.exports.Building = Building;
module.exports.User = User;