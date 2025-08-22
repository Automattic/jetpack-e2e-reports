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
				<Navbar
					variant="dark"
					expand="md"
					className="app-nav-bar"
					role="navigation"
					aria-label="Main navigation"
				>
					<Container fluid className="app-nav-bar-inner-container">
						<Navbar.Brand href={ `${ basename }/#/` } aria-label="Home - Jetpack test reports">
							Jetpack test reports
						</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation menu" />
						<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
							<Nav activeKey={ location.pathname } className="ml-auto" role="menubar">
								<Nav.Link
									href={ `${ basename }/#/reports` }
									role="menuitem"
									aria-label="View test reports"
								>
									Reports
								</Nav.Link>
								<Nav.Link
									href={ `${ basename }/#/stats` }
									role="menuitem"
									aria-label="View statistics"
								>
									Stats
								</Nav.Link>
								<Nav.Link
									href={ `${ basename }/#/tests` }
									role="menuitem"
									aria-label="View test results"
								>
									Tests
								</Nav.Link>
								<Nav.Link
									href={ `${ basename }/#/errors` }
									role="menuitem"
									aria-label="View error reports"
								>
									Errors
								</Nav.Link>
								{ /* <Nav.Link href={ `${ basename }/#/performance` } role="menuitem" aria-label="View performance metrics">Performance</Nav.Link> */ }
							</Nav>
						</Navbar.Collapse>
					</Container>
				</Navbar>
				<HashRouter>
					<ErrorBoundary>
						<Suspense fallback={ <LoadingState isLoading={ true } loadingText="Loading..." /> }>
							<Routes>
								<Route
									exact
									path="/"
									element={
										<ErrorBoundary>
											<ReportView />
										</ErrorBoundary>
									}
								/>
								<Route
									exact
									path="/reports"
									element={
										<ErrorBoundary>
											<ReportView />
										</ErrorBoundary>
									}
								/>
								<Route
									exact
									path="/tests"
									element={
										<ErrorBoundary>
											<TestsView />
										</ErrorBoundary>
									}
								/>
								<Route
									exact
									path="/errors"
									element={
										<ErrorBoundary>
											<ErrorsView />
										</ErrorBoundary>
									}
								/>
								<Route
									exact
									path="/performance"
									element={
										<ErrorBoundary>
											<PerformanceView />
										</ErrorBoundary>
									}
								/>
								<Route
									exact
									path="/charts"
									element={
										<ErrorBoundary>
											<StatsView />
										</ErrorBoundary>
									}
								/>
								<Route
									exact
									path="/stats"
									element={
										<ErrorBoundary>
											<StatsView />
										</ErrorBoundary>
									}
								/>
							</Routes>
						</Suspense>
					</ErrorBoundary>
				</HashRouter>
			</div>
			<footer className="App-footer" role="contentinfo" aria-label="Site footer">
				<div>
					<a
						target="_blank"
						href="https://github.com/Automattic/jetpack-e2e-reports/"
						rel="noreferrer"
						aria-label="View source code on GitHub"
					>
						Code
					</a>
					{ ' • ' }
					<a
						target="_blank"
						href="https://github.com/Automattic/jetpack-e2e-reports/actions"
						rel="noreferrer"
						aria-label="View GitHub Actions workflow runs"
					>
						Actions
					</a>
				</div>
			</footer>
		</Container>
	);
}

export default App;
