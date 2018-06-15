const mongoose = require('mongoose');
const moviesummarySchema = require('./moviesummary.js');
const Schema = mongoose.Schema;

//Schema MovieCollect created below
const MovieSchema = new Schema({
	movie: {
		type: String,
		validate: {
			validator: (movie) => movie.length > 2,
			message: 'Movie Name must be longer than 2 character'
		},
		required: [true, 'Movie Name cant be empty']	//stating that movie variable cant be null, and error message as exception
	},
	//blogcount: Number, //virtual type not defined in Schema
	moviesummary: [moviesummarySchema],
	/*since there is an [] in property of variable 'moviesummary', so mongoose will assume that this is an array of document
	and also there is Schema defined inside [](moviesummarySchema at the top declaration), thus mongoose will assume that this is 
	an nested sub-document*/
	dislikes: Number,
	movieblogs: [{
		type: Schema.Types.ObjectId,
		ref: 'movieblogcollection'
	}]
	});

/*Gitter & Setter of ES6*/
/*Virtual type is defined outside of schema, and it not actually stored in database, but instead it's value is
calculated while retreival from below function logic*/
/*In below virtual type logic code, we didn't use fat arrow function because it's scope will be defined to this block itself
thus we used function below logic code*/

MovieSchema.virtual('blogcount').get(function() {
	return this.moviesummary.length;	//'this' represent model instance of model MClass
});

MovieSchema.pre('remove', function(next) {
	const MBClass = mongoose.model('movieblogcollection');
	/*we don't directly refer to MBClass(code logic: MBClass.remove()..) because in that case we have to declare movieblog.js path in above,
	similarly inside movieblog.js, we may also have to refer to MClass directly, which will cause infinite loop*/
	
	MBClass.remove({ _id: {$in: this.movieblogs}})
		.then(() => next());
	/*To be learned afterwards of MBClass.remove() LOC*/
	/*we are using next(){in other code done()}, because above LOC will take some amout of time, and since these test are
	asysnchorous in nature, so we are using next(), so that other pre/post function doesn't get executed. By using next()
	we implies that next pre function will get executed*/
	
})
/*pre middleware is executing before any remove events: */

//Collection moviecollection created below
const MClass = mongoose.model('moviecollection', MovieSchema);

module.exports = MClass;