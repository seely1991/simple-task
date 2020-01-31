const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
	name: String,
	email: String,
	password: String,
	projects: [],
	profileColor: String
})

module.exports = new mongoose.model('list_user', userSchema);