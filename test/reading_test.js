const assert = require('assert');
const mongoose = require('mongoose');
const MCollection = require('../src/movie.js');

describe('Reading movie name from database:',() => {
	let MName,MName1,MName2,MName3;
	
	/*beforeEach is used as it will delete all records before beginning test, so before of deletion of this records
	it save before deleting them*/
	
	beforeEach((done) => {
		MName = new MCollection ({movie : 'Thor : The Dark World'}); /*not using const in order to make reference of MName instance outside of beforeEach block*/
		MName1 = new MCollection({movie : 'Thor : Ragnorak'});
		MName2 = new MCollection({movie : 'Captain America: The First Avenger'});
		MName3 = new MCollection({movie : 'Captain America: The Winter Soilder'});
		/*MName.save()
			.then(() => done()); 
			/* saving takes some time, so to make sure that other part of code are not executed before 
			saving done() call is returned only when save() is completed
			.then will only be run when above operation (MName.save()) is finished */
		Promise.all([MName.save(),MName1.save(),MName3.save(),MName2.save()])
			.then(() => done());
	});
	
	it('Finding movie name from database',(done) => {
		MCollection.find({movie : 'Thor : The Dark World'})	//find() provide all output for a given query
			.then((moutput) => {
				console.log('Movie Read by name:', moutput);
				//console.log(moutput[0]._id); //mongoose assign an _id to each records even before it's saved to MongoDB, then the same _id is in MongoDB as well.
				//console.log(MName._id);
				assert(moutput[0]._id.toString() === MName._id.toString());
				done();
			});
	});
	
	it('Finding movie with particular ID',(done) => {
		MCollection.findOne({ _id : MName._id}) //findOne() provide the first outout from set of all output from a query
			.then((MFindID) => {				/*MFindID is the output of findOne(), and .then will only be executed if findOne() is executed*/
				assert(MFindID.movie === 'Thor : The Dark World');
				console.log('Movie _id Read:', MFindID._id);
				done();
			});
	});
	
	it('Skip & Limit function in records', (done) => {
		MCollection.find({})	
		/*entering a blank search in find({}), will give you all results for which collection we are searching for*/
			.sort({movie: 1})	
			/*sort will sort the output provided from find() in above LOC based on criteria(variable within collection schema)
			,1 as ascending & -1 as decending*/
			.skip(1)
			.limit(2)
			.then((sloutput) => {
				console.log('Skip & Limit test output:', sloutput);
				assert(sloutput[0].movie === 'Captain America: The Winter Soilder');
				assert(sloutput[1].movie === 'Thor : Ragnorak');
				done();
			});
	});
	/*Skip function will skip number(defined inside skip() function) of results*/
	/*limit function will limit(defined inside limit() function) of results at a time*/
});