// Get express
const express= require('express');
const app = express();
// Get cors
const cors = require('cors');
// Get dotenv
const dotenv = require('dotenv');
dotenv.config();
// Get body-parser
const bodyParser = require('body-parser'); 
// Import server functions
const serverFunctions = require('./server-functions'); 
//Import path
const path = require('path');

// Set port
const PORT = process.env.PORT || 5000;

//Set initial variables
const collectionName = 'tasks'

//List of middlewares
// For cors request to igonore CORS rules
app.use(cors());
// For parsing json
app.use(express.json());

//Connect to the database, depending if connection is already established
serverFunctions.connect(collectionName);

//Use routes
const taskRoutes = require('./routes/task-routes')
app.use('/tasks',taskRoutes);

// Not working for now
// // ADD THIS LINE for static folder - IMPORTANT
// app.use(express.static('../react-frontend/build'));

// // // If no tasks routes are hit, send to the React app - IMPORTANT
// app.use(function(req, res) {
// 	res.sendFile(path.join(__dirname,'../','react-frontend/build/index.html'));
// });

//Start server
app.listen(PORT, ()=>console.log(`Server is running at Port ${PORT}`));