import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ReportsTable from './ReportsTable';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Metrics from './Metrics';

function NavBar( { activeNavbar, setActiveNavbar } ) {
	return (
		<Navbar variant="dark" className="App-nav">
			<Navbar.Brand href="#">Jetpack E2E Dashboard</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto" activeKey={ activeNavbar }>
					<Nav.Link
						href="#"
						eventKey="0"
						onSelect={ ( navbar ) => setActiveNavbar( navbar ) }
					>
						Recent reports
					</Nav.Link>
					<Nav.Link
						href="#"
						eventKey="1"
						onSelect={ ( navbar ) => setActiveNavbar( navbar ) }
					>
						Metrics
					</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

function AppContent( { activeNavbar } ) {
	console.log( 'QQQQQQ', activeNavbar );
	return (
		<div className="App-content">
			{ activeNavbar === '0' ? <ReportsTable /> : <Metrics /> }
		</div>
	);
}

function Header( { activeNavbar, setActiveNavbar } ) {
	return (
		<div>
			<header className="App-header">&nbsp;</header>
			<NavBar
				activeNavbar={ activeNavbar }
				setActiveNavbar={ setActiveNavbar }
			/>
		</div>
	);
}

function footer() {
	return (
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
	);
}

function App() {
	const [ activeNavbar, setActiveNavbar ] = useState( 0 );

	return (
		<Container fluid className="App">
			<Header
				activeNavbar={ activeNavbar }
				setActiveNavbar={ setActiveNavbar }
			/>
			<AppContent activeNavbar={ activeNavbar } />
			{ footer() }
		</Container>
	);
}

export default App;
