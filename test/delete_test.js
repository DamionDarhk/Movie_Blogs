const assert = require('assert');
const MClass = require('../src/movie.js');

describe('deleting a user :', () => {
	let MInstance1;
	
	beforeEach((done) => {
		MInstance1 = new MClass({movie : 'Batman Begins'});
		MInstance1.save()
			.then(() => done());
	});
	
	it('Model Instance remove', (done) => {
		MInstance1.remove()
			.then(() => MClass.findOne({ movie : 'Batman Begins'}))	//movie is an object here
			.then((moutput) => {				
				assert(moutput === null);
				console.log('Model Instance remove Output:',moutput);
				done();
			});
	});
	
	/*In Model Instance remove, 2 nested promise are executed(in form of .then) after execution of remove()
	1st promise(.then) is executed only when remove() is completed
	2nd promise(.then) is executed after 1st promise(.then) is executed, 
	and is giving moutput as an output of findOne() from 1st promise*/
	
	it('Class Method remove', (done) => {
		MClass.remove({movie : 'Batman Begins'})
			.then(() => MClass.findOne({ movie : 'Batman Begins'}))
			.then((moutput1) => {				
				assert(moutput1 === null);
				console.log('Class Method remove Output:',moutput1);
				done();	
			});
	});
	
	/*In Class Method remove, it's searching whole Collection/Class (MClass) for exact movie name (output can be multiple)
	and once it find then it will delete all of them by remove()*/
	
	it('Class Method findOneAndRemove', (done) => {
		MClass.findOneAndRemove({movie : 'Batman Begins'})
			.then(() => MClass.findOne({ movie : 'Batman Begins'}))
			.then((moutput2) => {				
				assert(moutput2 === null);
				console.log('Class Method findOneAndRemove Output:',moutput2);
				done();	
			});
	});
	/*In findOneAndRemove, it's going to find first output amongst from the batches of searches whose movie name is exactly
	Batman Begins, and delete the first records*/
	
	it('Class Method findByIdAndRemove', (done) => {
		MClass.findByIdAndRemove(MInstance1._id)
			.then(() => MClass.findOne({ movie : 'Batman Begins'}))
			.then((moutput3) => {				
				assert(moutput3 === null);
				console.log('Class Method findByIdAndRemove Output:',moutput3);
				done();	
			});
	});
	/*In findByIdAndRemove, it will get the _id property from instance MInstance1, 
	and delete all records w/ provided _id*/
	
});

/*
there are 4 ways of deleting data from MongoDB via mongoose framework :
Model Instance : Used in instance of records : MInstance1
	remove() : Used when we have direct referene to records

Model Class : Used in Model/Collection/Class i.e MClass of an database
	remove() : Used to remove couple of records based on given criteria
	findOneAndRemove() :
	findByIdAndRemove() :

*/