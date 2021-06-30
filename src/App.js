import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ReportsTable from './ReportsTable';

function reportsList() {
	return (
		<div className="App-content">
			<ReportsTable />
		</div>
	);
}

function header() {
	return <header className="App-header">&nbsp;</header>;
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
	return (
		<div className="App">
			{ header() }
			{ reportsList() }
			{ footer() }
		</div>
	);
}

export default App;
