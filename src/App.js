import React, { useState } from 'react';
import ReactGA from 'react-ga';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Reports from './Reports';
import Metrics from './Metrics';

const TRACKING_ID = 'UA-208890082-1';
ReactGA.initialize( TRACKING_ID );

const linkOnSelect = ( setActiveNavbar, navbar ) => {
	setActiveNavbar( navbar );
	location.hash = navbar;
};

function NavBar( { activeNavbar, setActiveNavbar } ) {
	return (
		<Navbar variant="dark" expand="md" className="app-nav-bar">
			<Container fluid className="app-nav-bar-inner-container">
				<Navbar.Brand href="#">
					Jetpack test results dashboard
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav activeKey={ activeNavbar } className="ml-auto">
						<Nav.Link
							href="#reports"
							onSelect={ ( navbar ) =>
								linkOnSelect( setActiveNavbar, navbar )
							}
						>
							Recent reports
						</Nav.Link>
						<Nav.Link
							href="#metrics"
							onSelect={ ( navbar ) =>
								linkOnSelect( setActiveNavbar, navbar )
							}
						>
							Metrics
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

function App() {
	const [ activeNavbar, setActiveNavbar ] = useState( '#reports' );
	if (
		location.hash &&
		[ '#reports', '#metrics' ].includes( location.hash ) &&
		activeNavbar !== location.hash
	) {
		setActiveNavbar( location.hash );
	}

	return (
		<Container fluid className="App">
			<div className="App-content">
				<NavBar
					activeNavbar={ activeNavbar }
					setActiveNavbar={ setActiveNavbar }
				/>
				{ activeNavbar === '#reports' ? <Reports /> : <Metrics /> }
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
