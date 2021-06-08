import './App.css';
import Data from './summary.json'

function reportLink(report) {
  const linkUrl = `https://automattic.github.io/jetpack-e2e-reports/${report.name}/report/`
  return (
    <div>
      <a href={linkUrl} className="App-link">{report.name}</a>
    </div>
  )
}

function reportsList() {
  return (
    <content className="App-content">
      {Data.reports.map(r => reportLink(r))}
    </content>
  )
  
}

function header() {
  return(
    <header className="App-header">
This is header
  </header>
  )
}

function footer() {
  return (
    <footer  className="App-footer">
      This is footer
    </footer>
  )
}

function App() {
  return (
    <div className="App">
      {header()}
        {reportsList()}
        {footer()}
    </div>
  );
}

export default App;
