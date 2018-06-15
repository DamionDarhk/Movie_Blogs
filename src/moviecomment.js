const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieCommentSchema = new Schema({
	content: String,
	commentor: {
		type: Schema.Types.ObjectId,
		ref: 'moviecollection'
	}	//we are defining commentor as single value variable as an comment can have only 1 commentor
});

const MCClass = mongoose.model('moviecommentcollection', MovieCommentSchema);

module.exports = MCClass;