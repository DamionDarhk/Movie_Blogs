const mongoose = require('mongoose');
const assert = require('assert');
const MClass = require('../src/movie.js');
const MBClass = require('../src/movieblog.js');
const MCClass = require('../src/moviecomment.js');

describe('Creating Association',() => {
	let minstance, mbinstance, mcinstance;

	beforeEach((done) => {
		minstance = new MClass({movie: 'The Last Jedi'});
		mbinstance = new MBClass({title: 'Amazing movie', content:'Just like what Star Wars represent'});
		mcinstance = new MCClass({content:'I loved this movie'});

		minstance.movieblogs.push(mbinstance);
		/*in MCClass model, movieblogs is an variable(defined inside MovieSchema) name that contains reference to MBClass,
		so in above code it's directly pointing to instance of MBClass*/
		/*Although in above code, we are referencing directly the instance of MBClass, but mongoose can detect the type of
		variable for movieblogs inside MClass(associating to other collection), and will get to know that it contains reference to MBClass collection,
		so it will not make any modification to mbinstance, and will only take ObjectId based on the same*/
		/*we used push for in case of movieblogs, as push is used in case of arrays(ES6 code), and inside MovieSchema
		movieblogs is defined as array*/

		mbinstance.comments.push(mcinstance);	//same logic used as in above code comments explained
		mcinstance.commentor = minstance;
		/*We are not using push here as inside MovieCommentSchema, we defined commentor as single variable value*/

		Promise.all([minstance.save(), mbinstance.save(), mcinstance.save()])
			.then(() => done());
		/*using promise.all will make sure that next line of code(either by reject i.e .catch or resolve i.e .then)
		will only be executed once all code operation defined in promise will executed */
		/*code operation defined inside of Promise will get executed in parallel*/
	});

	it('verification of result b/w movies and its blogs', (done) => {
		MClass.findOne({movie: 'The Last Jedi'})
			.populate('movieblogs')
			/*populate is an modifier, used to give output for nested sub-relation w/ reference to other docs or collection*/
			.then((assoutput) => {
				console.log('Association Test Output:', assoutput);
				assert(assoutput.movieblogs[0].title === 'Amazing movie');
				done();
			});
	});
	/*if syntax 'it.only' is used in an 'it' block, it will make sure that amongst all it block in all *.js code,
	only this will get executed*/

	it('output of full relation graph/tree', (done) => {
		MClass.findOne({movie: 'The Last Jedi'})
		.populate({
			path: 'movieblogs',
			/*in above LOC we have input as records from MClass, it contains variable name(movieblogs),
			defined inside schema(MovieSchema), which will refer to other collection*/
			model: 'movieblogcollection',
			/*it contains collection name which we want to refer based on above 'path'*/
			populate: {
				path: 'comments',
				/*in above LOC we have input as records from MBClass, as we defined above*/
				model: 'moviecommentcollection',
				populate: {
					path: 'commentor',
					model: 'moviecollection'
				}
			}
		})
		.then((assoutput) => {
			//console.log('Output of multiple models tree test 1:', assoutput);
			//console.log('Output of multiple models tree test 2:', assoutput.movieblogs[0]);
			//console.log('Output of multiple models tree test 3:', assoutput.movieblogs[0].comments[0]);
			assert(assoutput.movie === 'The Last Jedi');
			assert(assoutput.movieblogs[0].title === 'Amazing movie');
			assert(assoutput.movieblogs[0].comments[0].content === 'I loved this movie');
			assert(assoutput.movieblogs[0].comments[0].commentor.movie === 'The Last Jedi');
			done();
		})
	});
});

/*mongoose doesn't load all nested sub-relation(inter connected schema) w/ reference to all other docs or collection,
as there might be large number of relation inside MongoDB, and it may take a while or crash MongoDB*/
