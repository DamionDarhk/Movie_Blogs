const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //telling mongoose to use ES6 Promise library instead of mongoose Promise library

before((done) => {
	mongoose.connect('mongodb://localhost/imdb_database'); //imdb_database will get created once any data is inserted in it.
	mongoose.connection
		.once('open', () => {console.log('DarKnight Mongo rises'), done();})
		.on('error', (error) => {
			console.warn('Error code:', error);
		});
}); /*before happens only once at the starting of test*/



beforeEach((done) => {
	const {moviecollections, movieblogcollections, moviecommentcollections} = mongoose.connection.collections ;
	moviecollections.drop(() => {
		movieblogcollections.drop(() => {
			moviecommentcollections.drop(() => {
				done();
			});
		});
	});
});	/*telling mongoose framework to delete all records in moviecollection database before beginning test*/
