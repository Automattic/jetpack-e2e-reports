import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { Suspense } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { HashRouter, Route, Routes } from 'react-router-dom';
import LoadingState from './components/LoadingState';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const ReportView = React.lazy( () => import( './views/ReportView' ) );
const TestsView = React.lazy( () => import( './views/TestsView' ) );
const StatsView = React.lazy( () => import( './views/StatsView' ) );
const ErrorsView = React.lazy( () => import( './views/ErrorsView' ) );
const PerformanceView = React.lazy( () => import( './views/PerformanceView' ) );

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
								<Nav.Link href={ `${ basename }/#/stats` }>Stats</Nav.Link>
								<Nav.Link href={ `${ basename }/#/tests` }>Tests</Nav.Link>
								<Nav.Link href={ `${ basename }/#/errors` }>Errors</Nav.Link>
								{ /* <Nav.Link href={ `${ basename }/#/performance` }>Performance</Nav.Link> */ }
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
				<HashRouter>
					<ErrorBoundary>
						<Suspense fallback={ <LoadingState isLoading={ true } loadingText="Loading..." /> }>
							<Routes>
								<Route exact path="/" element={ <ErrorBoundary><ReportView /></ErrorBoundary> } />
								<Route exact path="/reports" element={ <ErrorBoundary><ReportView /></ErrorBoundary> } />
								<Route exact path="/tests" element={ <ErrorBoundary><TestsView /></ErrorBoundary> } />
								<Route exact path="/errors" element={ <ErrorBoundary><ErrorsView /></ErrorBoundary> } />
								<Route exact path="/performance" element={ <ErrorBoundary><PerformanceView /></ErrorBoundary> } />
								<Route exact path="/charts" element={ <ErrorBoundary><StatsView /></ErrorBoundary> } />
								<Route exact path="/stats" element={ <ErrorBoundary><StatsView /></ErrorBoundary> } />
							</Routes>
						</Suspense>
					</ErrorBoundary>
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
