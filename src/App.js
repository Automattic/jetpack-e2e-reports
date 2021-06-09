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
	return <header className="App-header">This is header</header>;
}

function footer() {
	return <footer className="App-footer">This is footer</footer>;
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
