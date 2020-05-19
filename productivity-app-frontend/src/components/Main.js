import React, { Component } from 'react';
import TaskList from './TaskList';
import axios from 'axios';
import { Link } from 'react-router-dom'

// DatePicker
import DatePicker from 'react-datepicker'
// DatePicker CSS
import "react-datepicker/dist/react-datepicker.css";

//Functional components added here
function EmptyList(){
	return(
		<div className='empty-list'><i className="fas fa-align-center"></i>Yay! You have no tasks for the day!</div>
	);
}

function Footer(){
	return(
		<footer>
			<p>Rishabh Sahejpal&apos;s Designs&copy;.</p>
		</footer>
	);
}

function Header(){
	return(
		<header>
			<nav>
				<div className="main-nav">
					<Link className="active col-6" to="/view"><i className="fas fa-align-justify"></i>Home</Link>
					<Link className="col-6" to="/docs"><i className="far fa-file"></i>Docs</Link>
				</div>
				<h1 className='main-heading'><i className="fas fa-clipboard-list"></i>Productivity Log</h1>		
			</nav>
		</header>

	);
}

			// url: 'https://productivity-app-express.herokuapp.com',
			// url: 'http://localhost:5000',

class Main extends Component {
	constructor(props){
		super(props);
		this.state = {
			url: 'https://productivity-app-express.herokuapp.com',
			input : '',
			checkbox : false,
			error: '',
			tasks : [],
			completed: [],
			priority: [],
			priorityComplete: [],
			date: new Date(),
			today: new Date().getDate() + '/' + (new Date().getMonth()+1) + '/' + new Date().getFullYear(),
			dateChoosenWithDatePicker: null,
			fullListAllowed: false,

		}

		this.handleInput = this.handleInput.bind(this);
		this.handleCheckBox = this.handleCheckBox.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDate = this.handleDate.bind(this);
		this.handleFullList = this.handleFullList.bind(this);
		this.setError = this.setError.bind(this);
		this.clearError = this.clearError.bind(this);
		this.getTasksByDate = this.getTasksByDate.bind(this);
		this.getFullListOfTasks = this.getFullListOfTasks.bind(this);
		this.insertTask = this.insertTask.bind(this);
		this.getProgress = this.getProgress.bind(this);
		this.getMonthFromString = this.getMonthFromString.bind(this);
	}

	handleInput = function(e){
		this.setState({
			input : e.target.value
		});
	}

	handleCheckBox = function(e){
		this.setState({
			checkbox : !this.state.checkbox
		});
	}

	handleSubmit = function(e){
		e.preventDefault();
		const submitDate = (this.state.dateChoosenWithDatePicker === null || this.state.dateChoosenWithDatePicker === undefined) 
							? this.state.today : this.state.dateChoosenWithDatePicker;
		const data = {
			name : this.state.input,
			date : submitDate,
			completed : false,
			priority : (this.state.checkbox)?true:false
		}
		if(data.name !== '' && data.name.length > 2){
			this.insertTask(data);
		}else{
			this.setError();
			return false;
		}
	}

	handleFullList = function(e){
		e.preventDefault();
		//Get all tasks
		this.getFullListOfTasks();
		//Set fullListAllowed to true
		this.setState({fullListAllowed : true});
	}

	handleDate = function(date){
		this.setState({
			date: date
		});
		//Reload the list
		// Set variables
		const dateArray = date.toString().split(' ');
		const day = dateArray[2]; 
		const year = dateArray[3]; 
		const month = this.getMonthFromString(dateArray[1]);
		const dateToSearch = day+'/' + month + '/'+year; 
		//Reload
		this.getTasksByDate(dateToSearch);
		//Update DateChoosen with dateChoosenWithDatePicker
		this.setState({dateChoosenWithDatePicker : dateToSearch});
		//Chage fulllist
		if(this.state.fullListAllowed)	this.setState({fullListAllowed : false});
	}

	getMonthFromString = function(string){
		switch(string){
			case 'Jan':
				return '1';
			case 'Feb':
				return '2';
			case 'Mar':
				return '3';
			case 'Apr':
				return '4';
			case 'May':
				return '5';
			case 'Jun':
				return '6';
			case 'Jul':
				return '7';
			case 'Aug':
				return '8';
			case 'Sep':
				return '9';
			case 'Oct':
				return '10';
			case 'Nov':
				return '11';
			case 'Dec':
				return '12';
			default:
				return false;
		}

	}

	setError = function(msg){
		if(msg !== undefined)
			this.setState({
				error: <React.Fragment><i className="fas fa-exclamation-circle"></i> {msg}</React.Fragment>
			})
		else
			this.setState({
				error: <React.Fragment><i className="fas fa-exclamation-circle"></i> Whoops! A task name should have minimum of 3 characters!</React.Fragment>
			})

	} 

	clearError = function(){
		this.setState({error: ''})
	}

	getProgress = function(){
		//Get all tasks, high prioprity tasks, completed tasks, and high priority completed tasks;
		// only difference is high priority tasks increase the score by factor of 3, hence need to add that as well
		//Other wise.completed and total would have worked
		const highPriorityScoreFactor = 3;
		const total = this.state.tasks.length;
		const highPriority = this.state.priority.length;
		const totalCompleted = this.state.completed.length;
		const highPriorityComplete = this.state.priorityComplete.length;

		const completedScore = ( highPriorityScoreFactor * highPriorityComplete ) + ( totalCompleted - highPriorityComplete );
		const totalScore = ( highPriorityScoreFactor * highPriority ) + ( total - highPriority );
		
		const percentage = Math.ceil(completedScore/totalScore * 100);
		if( percentage >= 0 ) return percentage;
		else return false;
	}

	getTasksByDate = function(dateProvided){
		let date = '';
		//get date
		if(dateProvided === undefined || dateProvided === null) date = this.state.today;
		else date = dateProvided;
		try{	
			axios.post(this.state.url+'/tasks/get',{
				body: {
					date
				}
			})
				.then(tasks => {
					this.setState({
						tasks: tasks.data.tasksReturned,
						completed: tasks.data.completeTasksReturned,
						priority: tasks.data.priorityTasksReturned,
						priorityComplete: tasks.data.priorityCompleteTasksReturned
					});
				})
				.catch(error=>console.log('AXIOS ERROR - GETTING TASKS: ', error));
		}catch(exception){
				console.log('AXIOS ERROR - GETTING', exception);
		}
	}

	getFullListOfTasks = function(){
		try{	
			axios.get(this.state.url+'/tasks/')
				.then(tasks => {
					this.setState({
						tasks: tasks.data.tasksReturned,
						completed: tasks.data.completeTasksReturned,
						priority: tasks.data.priorityTasksReturned,
						priorityComplete: tasks.data.priorityCompleteTasksReturned
					});
				})
				.catch(error=>console.log('AXIOS ERROR - GETTING TASKS: ', error));
		}catch(exception){
				console.log('AXIOS ERROR - GETTING', exception);
		}
	}

	insertTask = function(data){
		//Insert 
			try{
				axios.post(this.state.url+'/tasks/add/',{
					body: data
				})
				.then(result=>{
					// Another query to get tasks
					this.getTasksByDate(this.state.dateChoosenWithDatePicker);
					//clear input
					this.setState({
						input : ''
					})
				})
				.catch(error=>console.log('AXIOS ERROR - INSERTING TASKS: ', error));
			}catch(exception){
				console.log('AXIOS ERROR-INSERTING: ', exception)
			}
			//Clear error
			this.clearError();
	}

	componentDidMount(){
		this.getTasksByDate();
	}

	render() {
		const progress = !this.getProgress() ? 0 : this.getProgress();
		const list = (this.state.tasks.length === 0)?
						<EmptyList/> : 
						<TaskList tasks={this.state.tasks}
							dateChoosenWithDatePicker={this.state.dateChoosenWithDatePicker}  
							fullListAllowed={this.state.fullListAllowed}
							functions={
								{
									getTasksByDate : this.getTasksByDate, 
									setError : this.setError,
									clearError : this.clearError,
									getFullListOfTasks : this.getFullListOfTasks 
								}	
							}/>;
		
		return (
			<React.Fragment>
				<Header/>
				<div className="container">
					<div className="row d-flex justify-content-center align-items-center">
						<div className="col-12 col-lg-7 main-container">
							<section className="tasks-header">
								<span className="error">{this.state.error}</span>
								<form className="d-flex">
									<div className="input-wrapper">
										<div className="input">
											<label className="d-none" htmlFor="new-task">Add a new task here:</label>
											<input type="text" name='new-task' placeholder="Add a new task" value={this.state.input} onChange={this.handleInput} />
										</div>
										<div className="input">
											<label htmlFor="new-task-priority"><i className="far fa-star"></i> Set priority as high:</label>
											<input type="checkbox" name="new-task-priority" checked={this.state.checkbox} onChange={this.handleCheckBox}/>
										</div>
									</div>
									<button className="button align-self-start" type="submit" onClick={this.handleSubmit}><i className="fas fa-plus"></i></button>
								</form>
								<div className="filter-tasks">
									<h2>Filter results <i className="fas fa-sort"></i></h2>
									<div className="filter-options">
										<p className='full-list'><a href="/" onClick={this.handleFullList}><i className="fas fa-clipboard-list"></i>All</a></p>
										<span className="separator">OR</span>
										<div className='datepicker-wrapper'>
											<p><i className="far fa-calendar-alt"></i></p>
											<DatePicker selected={this.state.date} onChange={this.handleDate}/>
										</div>
									</div>
								</div>
							</section>
							<section className="stats">
								<div className="row">
									<div className="col-4 score">
										<p><span>Completed<i className="fas fa-caret-right"></i></span> {this.state.completed.length}/{this.state.tasks.length}</p>
									</div>
									<div className="col-8 progress">
										<div className="progress-wrapper">
											<span style={{width : progress+'%'}} className="bar"></span>
											<span style={{left : 'calc('+progress+'% - .5rem)'}} className="value">{progress}%</span>
										</div>
									</div>
								</div>
							</section>
							<main>
								<h3><i className="far fa-list-alt"></i>Your Tasks</h3>
								{list}
							</main>
						</div>
					</div>
				</div>
				<Footer/>
			</React.Fragment>

		);
	}
}

export default Main;
