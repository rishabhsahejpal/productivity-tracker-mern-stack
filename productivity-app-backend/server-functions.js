// Get dotenv
const dotenv = require('dotenv');
dotenv.config();
//Get mongodb - All steps(From connect driver)
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = process.env.URI;

const serverFunctionsObject = {

	ENV : {
		//Used to prevent reopening of connection 
		db : null,
		collections : {}
	},

	// Function to connect to client
	connect :  async function(collectionName){
		var self = this;
		//Check if connections is already open
		if(self.ENV.db !== null){/*Run the callback*/ self.connectCallBack();}
		else{
			// create an instance of MongoClient Class
			const client = new MongoClient(uri,{
									useNewUrlParser:true,
									useUnifiedTopology: true
								});

			//Connect here : Remember connect() returns Promise, therefore await 
			try{
				await client.connect();
				const database = client.db(process.env.DB);
				//Assign the database variable for enviroment
				self.ENV.db = database;
				const tasks = database.collection(collectionName);
				self.ENV.collections[collectionName] = tasks;
				console.log(`Successfully Connected To Database:- ${self.ENV.db.databaseName}`);
				//Run the callback
				self.connectCallBack('first');
			}catch(exception){
				//Run the callback
				self.connectCallBack(exception);
			}
		}
	},

	connectCallBack: function(state){
		var self = this;
		//Check if its first connection - fix it
		if(state && state !=='first') console.log('Error Occured While Connecting To Database:- ' + state)
		else if(state === 'first') console.log('We Have Established The First Conection To Database:- ' + self.ENV.db.databaseName)
		else console.log('We Are Already Connected To The Database:- ' + self.ENV.db.databaseName);
	},

	close : function(client){
		client.close();
		console.log('MongoDb connection is closed')
	},

	// Get all tasks
	getTasksAll : function(response){
		var self = this;
		const tasks = self.ENV.collections.tasks;
		//Try finding tasks  - Query 1//Sort by descending id & descending date
		tasks.find({}).sort({date:-1,_id:-1}).toArray(function(error,tasksReturned){
			if(error){
				response.send('Error-Getting-Completed-Tasks-All: ' + error);
				console.log('Error-Getting-Completed-Tasks-All: ' + error);
			}else{
				console.log(`Successfully Sending Back Tasks-All from Collection 'tasks'`)
				//Get completed tasks - Query 2
				const query = {completed:true};
				tasks.find(query).sort({_id:-1}).toArray(function(error,completeTasksReturned){
					if(error){
						response.send('Error-Returning-Completed-Tasks-All: ' + error);
						console.log('Error-Returning-Completed-Tasks-All: ' + error);
					}else{
						console.log(`Successfully Sending Back Completed Tasks-All from Collection 'tasks'`)
						//Get high priority tasks - Query 3
						const query = {priority:true};
						tasks.find(query).sort({_id:-1}).toArray(function(error,priorityTasksReturned){
							if(error){
								response.send('Error-Returning-Priority-Tasks-All: ' + error);
								console.log('Error-Returning-Priority-Tasks-All: ' + error);
							}else{
								console.log(`Successfully Sending Back High Priority Tasks-All from Collection 'tasks'`)
								//Get high priority tasks - Query 3
								const query = {priority:true,completed: true};
								tasks.find(query).sort({_id:-1}).toArray(function(error,priorityCompleteTasksReturned){
									if(error){
										response.send('Error-Returning-Priority-Completed-Tasks-All: ' + error);
										console.log('Error-Returning-Priority-Completed-Tasks-All: ' + error);
									}else{
										//Send response for all three calls
										response.json({tasksReturned,completeTasksReturned,priorityTasksReturned,priorityCompleteTasksReturned});	
										console.log(`Successfully Sending Back High Priority Completed Tasks-All from Collection 'tasks'`)	
									}
								});	
							}
						});
					}
				});
			}
		});
	},

	getTasksByDate : function(date,response){
		var self = this;
		const tasks = self.ENV.collections.tasks;
		const query = {date: date};
		//Try finding tasks  - Query 1
		tasks.find(query).sort({_id:-1}).toArray(function(error,tasksReturned){
			if(error){
				response.send('Error-Getting-Completed-Tasks-By-Date: ' + error);
				console.log('Error-Getting-Completed-Tasks-By-Date: ' + error);
			}else{
				console.log(`Successfully Sending Back Tasks By Date from Collection 'tasks'`)
				//Get completed tasks - Query 2
				const query = {date,completed:true};
				tasks.find(query).sort({_id:-1}).toArray(function(error,completeTasksReturned){
					if(error){
						response.send('Error-Returning-Completed-Tasks-By-Date: ' + error);
						console.log('Error-Returning-Completed-Tasks-By-Date: ' + error);
					}else{
						console.log(`Successfully Sending Back Completed Tasks By Date from Collection 'tasks'`)
						//Get high priority tasks - Query 3
						const query = {date,priority:true};
						tasks.find(query).sort({_id:-1}).toArray(function(error,priorityTasksReturned){
							if(error){
								response.send('Error-Returning-Priority-Tasks-By-Date: ' + error);
								console.log('Error-Returning-Priority-Tasks-By-Date: ' + error);
							}else{
								console.log(`Successfully Sending Back High Priority Tasks By Date from Collection 'tasks'`)
								//Get high priority tasks - Query 3
								const query = {date,priority:true,completed: true};
								tasks.find(query).sort({_id:-1}).toArray(function(error,priorityCompleteTasksReturned){
									if(error){
										response.send('Error-Returning-Priority-Completed-Tasks-By-Date: ' + error);
										console.log('Error-Returning-Priority-Completed-Tasks-By-Date: ' + error);
									}else{
										//Send response for all three calls
										response.json({tasksReturned,completeTasksReturned,priorityTasksReturned,priorityCompleteTasksReturned});	
										console.log(`Successfully Sending Back High Priority Completed Tasks By Date from Collection 'tasks'`)	
									}
								});	
							}
						});
					}
				});
			}
		});
	},

	// Insert task
	insertTask : function(data,response){
		var self = this;
		
		const tasks = self.ENV.collections.tasks;
		try{
			tasks.insertOne(data,function(error){
				try{
					//Send response
					response.json('Inserted a new task')	
					console.log('Successfully Inserted A Task With Name: "' + data.name + '"');
				}catch(exception){
					console.log('Error-Inserting: ' + exception);
					response.send('Error-Inserting: ' + exception);
				}
			});
		}catch(exception){
			console.log('Error-Using-Insert: ' + exception);
			response.send('Error-Using-Insert: ' + exception);
		}
	},

	updateTask : function(id,updatedValues,response){
		var self = this;
		const tasks = self.ENV.collections.tasks;
		try{
			const taskId = id;
			const o_ID = require('mongodb').ObjectID(taskId);

			const toUpdate = { _id : o_ID };
			const query = {$set : updatedValues};
			// console.log(query);
			// console.log(toUpdate);
			tasks.updateOne(toUpdate, query,function(error,result){//updatedValues = " $set : {} "
				try{
					response.json('Updated the provided task')	
					console.log('Successfully Updated The Task With _id: "' + toUpdate._id + '"');
				}catch(exception){
					console.log('Error-Updating: ' + exception);
					response.send('Error-Updating: ' + exception);
				}
			});
		}catch(exception){
			console.log('Error-Using-Update: ' + exception);
			response.send('Error-Using-Update: ' + exception);
		}
	},

	deleteTask : function(id,response){
		var self = this;
		const tasks = self.ENV.collections.tasks;
		try{
			const taskId = id;
			const o_ID = require('mongodb').ObjectID(taskId);

			const toDelete = { _id : o_ID };
			// console.log(toUpdate);
			tasks.deleteOne(toDelete,function(error,result){
				try{
					response.json('Deleted the provided task')	
					console.log('Successfully Deleted The Task With _id: "' + toDelete._id + '"');
				}catch(exception){
					console.log('Error-Deleting: ' + exception);
					response.send('Error-Deleting: ' + exception);
				}
			});
		}catch(exception){
			console.log('Error-Using-Delete: ' + exception);
			response.send('Error-Using-Delete: ' + exception);
		}

	},
}

module.exports = serverFunctionsObject;