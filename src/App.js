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
	return <footer className="App-footer">&nbsp;</footer>;
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
