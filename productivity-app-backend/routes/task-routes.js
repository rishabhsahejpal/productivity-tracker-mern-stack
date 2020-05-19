// Import router form express
const router = require('express').Router();
// Import server functions
const serverFunctions = require('../server-functions'); 

//Set routes for tasks
//Get all tasks
router.route('/').get((req,res) =>{
	serverFunctions.getTasksAll(res);
});

router.route('/get').post((req,res) =>{
	serverFunctions.getTasksByDate(req.body.body.date,res);
});

//Insert task
router.route('/add').post(function(req,res){
	serverFunctions.insertTask(req.body.body, res);
});

//Update task
router.route('/update/:id').post(function(req,res){
	// console.log(req.body.body);
	// console.log(req.params.id);
	serverFunctions.updateTask(req.params.id,req.body.body, res);
});

//Update task
router.route('/delete/:id').get(function(req,res){
	// console.log(req.body);
	serverFunctions.deleteTask(req.params.id, res);
});

module.exports = router;