import React, { Component } from 'react';
import axios from 'axios';


class TaskListLis extends Component {
	constructor(props){
		super(props);
		this.state = {
			url: 'https://productivity-app-express.herokuapp.com',
			input: '',
			allowEdit: false,
			completed: this.props.task.completed,
			date: new Date(),
			today: new Date().getDate() + '/' + (new Date().getMonth()+1) + '/' + new Date().getFullYear(),
		}

		this.handleEdit = this.handleEdit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleCompleted = this.handleCompleted.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.updateCompletedTask = this.updateCompletedTask.bind(this);
	}

	handleInput = function(e){
		this.setState({
			input : e.target.value
		});
	}

	handleEdit = function(e) {
		// Update state.allowEdit
		this.setState({allowEdit : !this.state.allowEdit})
	}

	handleDelete = function(e) {
		const id = e.target.getAttribute('data-id');
		var self = this;

		// Handle make the li disappear and delete after '1' second
		e.target.closest('li').className +=  'squeeze';
		//Remove after 1s
		setTimeout(function(){
			// Handle Delete
			self.deleteTask(id);
		},1000);
	
	}	

	handleCancel = function(e){
		//Only update the state.allowEdit and clear state.input
		this.setState({
			allowEdit : !this.state.allowEdit,
			input : ''
		});
	}

	handleSave = function(e){
		const id = e.target.getAttribute('data-id');
		//Handle Save
		if(this.state.input.length>2){
			const data = {
				name : this.state.input
			}
			//Run save
			this.updateTask(id,data);
			//Clear error
			this.props.functions.clearError();
		}else{
			this.props.functions.setError();
			return false;
		} 
	}

	handleCompleted = function(e){
		const id = e.target.getAttribute('data-id');
		this.setState({completed: !this.state.completed});
		const data = {
			completed : true
		}
		//Run save
		this.updateCompletedTask(id,data);
	}


	deleteTask = function(id){
		try{
			axios.get(this.state.url+'/tasks/delete/'+id)
				.then(result=>{
					//Reload the list again according to if it is full list or specific date
					if(!this.props.fullListAllowed)
						this.props.functions.getTasksByDate(this.props.dateChoosenWithDatePicker);
					else
						this.props.functions.getFullListOfTasks();
				})
				.catch(error=>console.log('AXIOS ERROR - DELETING TASK: ', error));
		}catch(exception){
				console.log('AXIOS ERROR - DELETING', exception);
		}
	}

	updateTask = function(id,data){
		try{
			axios.post(this.state.url+'/tasks/update/'+id,{
				body: data
			})
				.then(result=>{
					//Reload the list again according to if it is full list or specific date
					if(!this.props.fullListAllowed)
						this.props.functions.getTasksByDate(this.props.dateChoosenWithDatePicker);
					else
						this.props.functions.getFullListOfTasks();
					//Cancel the field
					this.handleCancel();
				})
				.catch(error=>console.log('AXIOS ERROR - UPDATING TASK: ', error));
		}catch(exception){
				console.log('AXIOS ERROR - UPDATING', exception);
		}
	}

	updateCompletedTask = function(id,data){
		try{
			axios.post(this.state.url+'/tasks/update/'+id,{
				body: data
			})
				.then(result=>{
					//Reload the list again
					this.props.functions.getTasksByDate();
				})
				.catch(error=>console.log('AXIOS ERROR - UPDATING TASK: ', error));
		}catch(exception){
				console.log('AXIOS ERROR - UPDATING', exception);
		}
	}

	render() {
		return (

							
			<li className=''>
				<div className="task-info">
					<p className={ this.state.allowEdit ?'d-none':'d-block'}>{this.props.task.name}</p>
					<form className={ !this.state.allowEdit ?'d-none':'d-block'}>
						<input type="text" placeholder={this.props.task.name} name='edit-task' value={this.state.input} onChange={this.handleInput} />
						<button type="button" className="button" data-id={this.props.task._id} onClick={this.handleSave}><i className="fas fa-share-square"></i>Save</button>
						<button type="button" className="button" onClick={this.handleCancel}><i className="fas fa-times"></i>Cancel</button>
					</form>
					<div className={ this.state.allowEdit ? 'd-none' : 'd-flex align-items-center justify-content-start d-block'}>
						<p><i className="far fa-calendar-check"></i>{this.props.task.date}</p>
						<span className="separator after-date">|</span>
						<ul className='task-options'>
							<button type="button" className="edit-task">
								<i onClick={this.handleEdit} className="fas fa-edit"></i>
							</button> 
							<span className="separator">|</span>
							<button type="button" className="delete-task">
								<i onClick={this.handleDelete} data-id={this.props.task._id} className="fas fa-trash-alt"></i>
							</button>
						</ul>	
					</div>
				</div>
				<div className={ this.state.allowEdit ?'d-none':'task-options d-flex'}>
					<div className="priority">
						<p className="heading">Priority</p>
						<p className={ this.props.task.priority ? "high":"normal" } >{ this.props.task.priority ? <i className="fas fa-star high"></i>:<i className="far fa-star"></i>}{ this.props.task.priority ? 'High' : 'Low'}</p>
					</div>
					<div className="completed">
						<p className="heading">Complete {this.props.task.completed}</p>
						<input type="checkbox" className={this.props.task.completed ? 'no-click':'allow-click'} data-id={this.props.task._id} checked={this.state.completed} onChange={this.handleCompleted}/>
					</div>
				</div>
			</li>
		);
	}
}

export default TaskListLis;
