const assert = require('assert');
const MClass = require('../src/movie.js');

describe('Validating records', () => {
	it('Require an user name', () => {
		const minstance2 = new MClass({movie: undefined});
		const validateoutput = minstance2.validateSync();	//validateoutput is the object of error(entire error stack trace) is generated
		//console.log('Validate Code Error:', validateoutput);
		const {message} = validateoutput.errors.movie;	//it's an pure ES6 javascript
		console.log('Required Error Message:', message);
		assert(message === 'Movie Name cant be empty');
	});
	
	it('Require Movie Name greater than 2 character', () => {
		const minstance2 = new MClass({movie: 'Ra'});
		const validateoutput = minstance2.validateSync();
		const {message} = validateoutput.errors.movie;
		console.log('Required Error Message for length limit:', message);
		assert(message === 'Movie Name must be longer than 2 character');
	});
	
	/*we are not defining beforeEach() block because we want to check validation while records are being entered,
	and all validation is happening within Mongoose framework*/
	
	it('Error handler when wrong records is entered in MongoDB', (done) => {
		const minstance2 = new MClass({movie: 'UP'});
		minstance2.save()
			.catch((validateoutput1) => {
				const {message} = validateoutput1.errors.movie;
				assert(message === 'Movie Name must be longer than 2 character');
				done();
			})
	});
	/*.catch is used in case of promise when an operation is failed, in order to handle failed operation
	and .then is used when an operation is successfully completed*/
});