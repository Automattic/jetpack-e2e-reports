module.exports = {
	root: true,
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended-with-formatting' ],
	parser: '@babel/eslint-parser',
	env: {
		browser: true,
	},

	rules: {
		'arrow-parens': [ 0, 'as-needed' ],
		'no-console': 0,
	},
};
