const assert = require('assert');
const MClass = require('../src/movie.js');

describe('Setting virtual class',() => {
	it('blogcount count based on blogcount comment', (done) => {
		const minstance = new MClass({
			movie: 'The Incredible Hulk',
			moviesummary: [{title: 'Ultimate Hulk movie'}],
			dislikes: 123
		});

		minstance.save()
			.then(() => MClass.findOne({movie: 'The Incredible Hulk'}))
			.then((soutput) => {
				console.log('Virtual Type Test-blogcount output:', soutput.blogcount);
				assert(soutput.blogcount === 1);
				done();
			});
	});
});
