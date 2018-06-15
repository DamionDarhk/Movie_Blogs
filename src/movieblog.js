const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieBlogSchema = new Schema({
	title: String,
	content: String,
	comments: [{
		type: Schema.Types.ObjectId,	//ObjectId of the moviecommentcollection records
		ref: 'moviecommentcollection'	
		//variable ref, holding collection name which we want to refer to other collection
	}]	//we are declaring comments as array type, as single blog may have multiple comments
});

const MBClass = mongoose.model('movieblogcollection', MovieBlogSchema);
/*Name of collection is defined above(in this case it's movieblogcollection), which will be used
to refer to other collection*/

module.exports = MBClass;