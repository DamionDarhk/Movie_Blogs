const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moviesummarySchema = new Schema({
	title: String
});

module.exports = moviesummarySchema;