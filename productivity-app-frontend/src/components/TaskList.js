import React, { Component } from 'react';
import TaskListLis from './TaskListLis';

class TaskList extends Component {
	constructor(props){
		super(props);
		this.setError = this.setError.bind(this);
		this.clearError = this.clearError.bind(this);
		this.createLis = this.createLis.bind(this);
		this.getTasksByDate = this.getTasksByDate.bind(this);
		this.getFullListOfTasks = this.getFullListOfTasks.bind(this);
	}

	setError(msg){
		this.props.functions.setError(msg);
	}

	clearError(){
		this.props.functions.clearError();
	}

	getTasksByDate(date){
		this.props.functions.getTasksByDate(date);
	}

	getFullListOfTasks(){
		this.props.functions.getFullListOfTasks();
	}

	createLis(){
		var self = this;
		return (
			self.props.tasks.map(function(task){
				return <TaskListLis task={task} key={task._id} 
							dateChoosenWithDatePicker={self.props.dateChoosenWithDatePicker}  
							fullListAllowed={self.props.fullListAllowed}  
							functions={
								{
									getTasksByDate : self.getTasksByDate, 
									setError : self.setError,
									clearError : self.clearError,
									getFullListOfTasks : self.getFullListOfTasks 

								}	
							}/>
			})
		);
	}

	render() {
		return <ul>{this.createLis()}</ul>;
	}
}

export default TaskList;
