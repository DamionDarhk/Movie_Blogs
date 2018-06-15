const assert = require('assert');
const MovieCollect = require('../src/movie.js');

describe('Creating records', () => {
	it('Saves Movie', (done) => { //done is available in it block
	const intersteller = new MovieCollect({movie: 'Infinity Space Hulk'}); //intersteller is Instance of MovieCollect Collection 
	
	intersteller.save()
		.then(() => {
			assert(!intersteller.isNew); //isNew is true when an record is still in mocha framework
			done();						 //assert will give error if return false, it returned true, mocha/mongoose will continue executing code.	
		});
	});
});	

/*3 parts in which create happens, all below happens in mocha framework, then it goes into MondoDB  :- 
 1. Create records
 2. Verify if records are saved or not by assert function
 3. Save records using save() into MondoDb
*/