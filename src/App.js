import React from 'react';
import ReactGA from 'react-ga';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Reports from './components/Reports';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Tests from './components/Tests';
import Charts from './components/Charts';
import Failures from './components/Failures';
import Performance from './components/Performance';

const TRACKING_ID = 'UA-208890082-1';
ReactGA.initialize( TRACKING_ID );

function App() {
	const basename = '/jetpack-e2e-reports';

	return (
		<Container fluid className="App">
			<div className="App-content">
				<Navbar variant="dark" expand="md" className="app-nav-bar">
					<Container fluid className="app-nav-bar-inner-container">
						<Navbar.Brand href={ `${ basename }/#/` }>Jetpack test reports</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
							<Nav activeKey={ location.pathname } className="ml-auto">
								<Nav.Link href={ `${ basename }/#/reports` }>Reports</Nav.Link>
								<Nav.Link href={ `${ basename }/#/charts` }>Stats</Nav.Link>
								<Nav.Link href={ `${ basename }/#/tests` }>Tests</Nav.Link>
								<Nav.Link href={ `${ basename }/#/failures` }>Failures</Nav.Link>
								<Nav.Link href={ `${ basename }/#/performance` }>Performance</Nav.Link>
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
				<HashRouter>
					<Routes>
						<Route exact path="/" element={ <Reports /> } />
						<Route exact path="/reports" element={ <Reports /> } />
						<Route exact path="/tests" element={ <Tests /> } />
						<Route exact path="/failures" element={ <Failures /> } />
						<Route exact path="/performance" element={ <Performance /> } />
						<Route exact path="/charts" element={ <Charts /> } />
					</Routes>
				</HashRouter>
			</div>
			<footer className="App-footer">
				<div>
					<a
						target="_blank"
						href="https://github.com/Automattic/jetpack-e2e-reports/"
						rel="noreferrer"
					>
						Code
					</a>
					{ ' • ' }
					<a
						target="_blank"
						href="https://github.com/Automattic/jetpack-e2e-reports/actions"
						rel="noreferrer"
					>
						Actions
					</a>
				</div>
			</footer>
		</Container>
	);
}

export default App;
