// .eslintrc.js
module.exports = {
	root: true,
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	env: {
		browser: true,
	},

	rules: {
		'arrow-parens': [ 0, 'as-needed' ],
		'no-console': 0,
		// 'jsdoc/check-tag-names': [ 'error', { definedTags: [ 'group' ] } ],
	},
};
