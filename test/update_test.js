const assert = require('assert');
const MClass = require('../src/movie.js');

describe('Updating records', () => {
	let MInstance;
	
	beforeEach((done) => {
		MInstance = new MClass({movie : 'The Dark Knight', dislikes: 10}); //MInstance is the javascript/server side representation
		MInstance.save()
			.then(() => done());
	});
	
	function opssaveverify(ops,done) {
		ops
		.then(() => MClass.find({}))	//by not entering any search criteria inside find(), it will provide all records of MClass
		.then((uoutput) => {
			assert(uoutput.length === 1);
			assert(uoutput[0].movie === 'The Dark Knight Rises');
			console.log('Output:', uoutput[0]);
			done();
		});
		
	}
	
	it('Model Instance Update by set n save', (done) => {
		console.log('Before Update Model Instance Update by set n save:', MInstance);
		MInstance.set('movie', 'The Dark Knight Rises');
		opssaveverify(MInstance.save(), done);
		/*
		MInstance.save()
			.then(() => MClass.find({}))	//by not entering any search criteria inside find(), it will provide all records of MClass
			.then((uoutput) => {
				assert(uoutput.length === 1);
				//console.log('Error Output:', uoutput[0].movie);
				assert(uoutput[0].movie === 'The Dark Knight Rises');
				done();
			});*/ //above line of code is without function opssaveverify
		console.log('After update Model Instance Update by set n save:', MInstance);
	});
	
	/*only by using MInstance.set() won't save records into MongoDB, 
	it will be there in mongoose framework(within memory of model). In order to save records, we have to use save()
	It is usefull in web application where by using set() multiple times, we can save the updated record within memory
	and then we can save finilized record into MongoDB using save(), 
	this way it will touch MongoDB only 1 time while using save()*/
	
	it('Model Instance Update by update', (done) => {
		console.log('Before Update Model Instance Update by update:', MInstance);
		opssaveverify(MInstance.update({movie : 'The Dark Knight Rises'}), done);
		console.log('After Update Model Instance Update by update:', MInstance);
	});
	/*In MInstance.update(), we are directly saving records into MongoDB instead of memory/mongoose framework like in
	set n save*/
	
	it('Model Class Update by update',(done) => {
		opssaveverify(MClass.update({movie : 'The Dark Knight'},{movie : 'The Dark Knight Rises'}), done);
	});
	/*In Model Class Update by update, we update record by using MClass.update(a,b) where 
	a=criteria given(like movie : 'The Dark Knight') where we have to find record based on that
	b=updated value given where we will update record provided by a(from above)*/
	
	it('Model Class Update by findOneAndUpdate', (done) => {
		opssaveverify(MClass.findOneAndUpdate({movie : 'The Dark Knight'},{movie : 'The Dark Knight Rises'}), done);
	});
	/*In Model Class Update by findOneAndUpdate, it's similat to Model Class Update, the only difference is that in 
	findOneAndUpdate(a,b) a will return only first output in provide search criteria*/
	
	it('Model Class Update by findByIdAndUpdate', (done) => {
		opssaveverify(MClass.findByIdAndUpdate(MInstance._id, {movie : 'The Dark Knight Rises'}), done);
	});
	/*In Model Class Update by findByIdAndUpdate, it'a also similar to Model Class Update, the only difference is that in
	findByIdAndUpdate(a,b), a will return a single output based in search criteria as _id(like MInstance._id)*/
	
	it('Movie blogcount can get increased by 1', (done) => {
		MClass.update({movie:'The Dark Knight'}, {$inc: {dislikes: -1}})
			.then(() => MClass.findOne({movie: 'The Dark Knight'}))
			.then((uoutput1) => {
				console.log('Movie blogcount Increased by 1:', uoutput1);
				assert(uoutput1.dislikes === 9);
				done();
			});
	});
	/*xit states that a particular it block isn't completed, and will not execute*/
	/*In updating records by $inc, it's done by MClass.update(a,b) where
	a=criteria given for which records need to be updated
	b=update systax need to be written, in our case it's $inc [{$inc: {blogcount: -1}}], here $inc is the increment operation
	that we are telling MongoDB with variable blogcount by 10(increasing current value to 10, if we want to decrease, then 
	use negative -1)*/
	
	/*The reason that why we are telling MongoDB to update record on behalf of us, is to avoid fetching the records into 
	our server which may lead to performance*/
	
	
});

/*
In total there are 5 ways to update records in MongoDB
Model Instance:
1. update:	directly update records(using update()) using instance of that record
2. set n save:	Will update the records multiple time in memory/mongoose framework, 
	and then will update record in MongoDB using save()
Model Collection/Class:
3.	update:
4.	findOneAndUpdate:
5.	findByIdAndUpdate:
*/