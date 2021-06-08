const fs = require( 'fs' );
const path = require( 'path' );

const dirs = fs.readdirSync('docs', { withFileTypes: true })
	.filter(dirent => dirent.isDirectory())
	.map(dirent => dirent.name)

const json = { reports: [] }

for (const d of dirs) {
	json.reports.push( { name: d, lastUpdate: "" } )
}

fs.writeFileSync(path.resolve('src/summary.json'), JSON.stringify(json, null, 2))
