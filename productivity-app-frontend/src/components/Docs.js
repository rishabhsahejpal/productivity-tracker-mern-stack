import React, { Component } from 'react';
import { Link } from 'react-router-dom'


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
					<Link className="col-6" to="/view"><i className="fas fa-align-justify"></i>Home</Link>
					<Link className="active col-6" to="/docs"><i className="far fa-file"></i>Docs</Link>
				</div>
				<h1 className='main-heading'><i className="fas fa-clipboard-list"></i>Productivity Log</h1>		
			</nav>
		</header>

	);
}


class Docs extends Component {

	render() {
		return (
			<React.Fragment>
				<Header />
				<div className="container">
					<div className="main-wrapper">
						<div className='text col-12 col-lg-7'>
							<h1><i className="far fa-file"></i>Documentation for productivity App(v1.0.0)</h1>
							<p>This is a simple application which keeps a log of your important day to day tasks. The application 
							uses the <span className="bold">MERN</span> stack with <span className="bold">ReactJS</span>  for front-end and <span className="bold">ExpressJS</span> for backend support.</p>
							<p>The applications <span className='bold'>prioritizes</span> the task and gives you update based on the priority sequence of different tasks.
							The pink star symbolises which tasks are considered as high prioprity task and that need to be finished.</p>
							<h2><i className="far fa-file"></i>Documentation for productivity App</h2>
							<p className="steps">- Go to the log page using '<span className="bold">View Logs</span>' button from the landing page</p>
							<p className="steps">- Add a task using the '<span className="bold">Add a task</span>' field and pressing '<span className="bold">+</span>' button</p>
							<p className="steps">- Choose different dates to view or edit task by pressing on calender and choosing the required date</p>
							<p className="steps">- <span className="bold">Edit/Delete</span> a task using appropiate buttons</p>
							<p className="steps">- Mark the task as completed by clicking on the checkbox under '<span className="bold">Complete</span>' heading</p>
							<p className="note">Note: Once a task is marked complete, it is not possible to change the status of the task without deleting it.</p>
							
							<h1 className="mt-5"><i className="far fa-file"></i>Resources for productivity App</h1>
							<p>The following resources were utilised for developing this application</p>
							<p className="steps"><span className="bold"><i className="far fa-clipboard"></i><a href="https://reactjs.org/docs/getting-started.html">ReactJS</a></span></p>
							<p className="steps"><span className="bold"><i className="far fa-clipboard"></i><a href="https://expressjs.com/en/api.html">ExpressJS</a></span></p>
							<p className="steps"><span className="bold"><i className="far fa-clipboard"></i><a href="https://fontawesome.com/">FontsAwesome</a></span></p>
							<p className="steps"><span className="bold"><i className="far fa-clipboard"></i><a href="https://getbootstrap.com/docs/4.5/getting-started/introduction/">Bootstrap</a></span></p>
							<p className="note">These were utilized along with <span className="bold uc">Html</span>, <span className="bold uc">CSS</span> and <span className="uc bold">Javascript</span></p>
						</div>
					</div>
				</div>
				<Footer/>
			</React.Fragment>

		);
	}
}

export default Docs;
