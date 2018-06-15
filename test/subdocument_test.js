const assert = require('assert');
const MClass = require('../src/movie.js');

describe('Subdocument', () => {
	it('Creating sub-document', (done) => {
		const minstance = new MClass({
			movie: 'Intersteller',
			moviesummary: [{title: 'Movie is physics awesome'}]
		})
		
		minstance.save()
		.then(() => MClass.findOne({movie: 'Intersteller'}))
		.then((soutput) => {
			assert(soutput.moviesummary[0].title === 'Movie is physics awesome');
			console.log('Output from sub-docs:', soutput);
			done();
		})
	});
	
	it('Add nested records to existing records', (done) => {
		const minstance = new MClass({
			movie: 'Guardian of the galaxy',
			moviesummary: []
		}); //Part 1 of adding nested document
		
		minstance.save() //Part 2
			.then(() => MClass.findOne({movie: 'Guardian of the galaxy'}))	//Part 3
			.then((soutput) => {
				soutput.moviesummary.push({title: 'Amazing space avengers movie'}); 
				/*Above's Part 4(push is an javascript code, which is used to insert data in an array)*/
				return soutput.save();	
				/*Part 5 executed above, in order for next .then to execute this .then(2nd .then) needs to return a value,
				only when soutput.save() is finished & returned, then only 3rd .then will execute,
				also nested docs needs to saved inside whole MClass model, as it doesn't have it's own model
				and moviesummary is also part of MClass model as well*/
			})
			.then(() => MClass.findOne({movie: 'Guardian of the galaxy'})) //Part 6
			.then((soutput1) => {
				console.log('Output from updated nested sub-docs:', soutput1);
				assert(soutput1.moviesummary[0].title === 'Amazing space avengers movie');//Part 7
				done();
			})
		/*Adding nested records(moviesummary) to existing records, 7 phase it will happen
		1. Create Instance(minstance)
		2. Save Instance
		3. fetch Instance
		4. Add/Updating nested records(moviesummary)
		5. Save Instance(updated records w/ updated nested records)
		6. fetch Instance
		7. Make Assertion*/
	});
	
	it('Remove existing nested document', (done) => {
		const minstance = new MClass({
			movie: 'What happened to Monday',
			moviesummary: [{title: 'Over-population solution'}]
		});
		
		minstance.save()
			.then(() => MClass.findOne({movie: 'What happened to Monday'}))
			.then((soutput) => {
				console.log('Before deletion of nested sub-docs:', soutput);
				soutput.moviesummary[0].remove();	//reference to nested document that needs to be deleted
				return soutput.save();	
				/*in order to update(finish the deletion of nested document) the records,
				we need to save instance of records*/
			})
			.then (() => MClass.findOne({movie: 'What happened to Monday'}))
			.then ((soutput1) => {
				console.log('After deletion of nested sub-docs:', soutput1);
				assert(soutput1.moviesummary.length === 0);
				done();
			});
	});
});