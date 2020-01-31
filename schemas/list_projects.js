const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const projectSchema = new Schema({
	title: String,
	lists: [],
	updated: String
})

module.exports = new mongoose.model('list_project', projectSchema);