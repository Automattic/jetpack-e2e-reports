const isDevelopment =
	process.env.NODE_ENV === 'development' ||
	( typeof window !== 'undefined' && window.location.hostname === 'localhost' );

const config = {
	permanent: [
		'atomic',
		'vip',
		'gutenberg',
		'jetpack-production',
		'jetpack-social-plugin',
		'jetpack-boost-production',
		'jetpack-search-plugin',
		'jetpack-videopress-plugin',
		'jetpack-protect-plugin',
		'ctrf',
		'junit',
	],
	trunkRuns: [
		'master',
		'trunk',
		'atomic',
		'vip',
		'gutenberg',
		'jetpack-production',
		'jetpack-social-plugin',
		'jetpack-boost-production',
		'jetpack-search-plugin',
		'jetpack-videopress-plugin',
		'jetpack-protect-plugin',
	],
	ignore: [ 'static', 'e2e', 'data' ],
	dataSourceURL: isDevelopment ? '.' : 'https://a8c-jetpack-e2e-reports.s3.amazonaws.com',
	reportDeepUrl: 'http://a8c-jetpack-e2e-reports.s3-website-us-east-1.amazonaws.com/reports',
};

// ES Module export for browser/React
export default config;

// CommonJS export for Node.js scripts
if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = config;
}
