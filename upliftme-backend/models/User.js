const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
	email : String,
	name : String,
	image : String,
	date : Date
})
module.exports = mongoose.model("User",UserSchema)
