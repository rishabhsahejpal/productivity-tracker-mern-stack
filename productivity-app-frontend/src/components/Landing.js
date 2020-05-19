import React, { Component } from 'react';

function Footer(){
	return(
		<footer>
			<p>Rishabh Sahejpal&apos;s Designs&copy;.</p>
		</footer>
	);
}


class Landing extends Component {

	render() {
		return (
			<React.Fragment>
				<div className="container">
					<div className="main-wrapper">
						<i className="fas fa-clipboard-list"></i>
						<h1 className="text-center">Welcome to your productivity log</h1>
						<p>A list of all your tasks for everyday!</p>
						<a className="button" href="/view">View Log</a>
					</div>
				</div>
				<Footer/>
			</React.Fragment>

		);
	}
}

export default Landing;
