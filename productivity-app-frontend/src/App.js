import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import Main from './components/Main'
import Landing from './components/Landing'
import Docs from './components/Docs'

function App() {
  return (
  	<Router>
	    <div className="App">
	      <Route path="/" exact component={Landing} />
	      <Route path="/view" component={Main} />
	      <Route path="/docs" component={Docs} />
	    </div>
    </Router>
  );
}

export default App;
