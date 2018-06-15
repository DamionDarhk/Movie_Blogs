const mongoose = require('mongoose');
const assert = require('assert');
const MClass = require('../src/movie.js');
const MBClass = require('../src/movieblog.js');

describe('Middleware test', () => {
	let minstance,mbinstance ;
	
	beforeEach((done) => {
		minstance = new MClass({movie: 'The Last Jedi'});
		mbinstance = new MBClass({title: 'Amazing movie', content:'Just like what Star Wars represent'});
		
		minstance.movieblogs.push(mbinstance);	
		
		Promise.all([minstance.save(), mbinstance.save()])
			.then(() => done());
		
	});
	
	it('Verification of middleware remove function', (done) => {
		minstance.remove()
			.then(() => MBClass.count())
			/*since in our testing environment, we have put only 1 records each for MClass & MBClass, thus we are searching
			for whole MBClass assuming that other that records entered in this beforeEach there is no other records and
			that's why we are comparing with 0 count of MBClass*/
			.then((blogcount) => {
				assert(blogcount === 0);
				//console.log('Test output 2 of middleware:', blogcount);
				done();
			});
	});
})