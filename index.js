module.exports = {
	extends: [
		"airbnb-base",
		"plugin:react/recommended",
		//"plugin:jsx-a11y/recommended",
	],
	parser: "typescript-eslint-parser",
	parserOptions: {
		ecmaVersion: 8,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
			modules: true
		}
	},
	plugins: [
		"import",
		"react",
		//"jsx-a11y", // warns about accessibility concerns
		//"babel",
		"only-warn",
	],
	settings: {
		//"import/extensions": [".js", ".jsx", ".ts", ".tsx"],
		"import/resolver": {
			"webpack": {
				"config": "./Scripts/Build/WebpackConfig.js",
			},
			"node": {
				"paths": ["Source"],
				"extensions": [
				  ".js",
				  ".jsx",
				  ".ts",
				  ".tsx",
				]
			 }
		}
	},
	env: {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"node": true
	},
	globals : {
		/*"DEV": false,
		"PROD": false,
		"TEST": false,*/
	},
	rules: {
		// fixes
		"strict": [1, "never"], // fix for extraneous (and incorrect) entry for "strict" rule in airbnb-base/index.js
		"padded-blocks": "off", // disabled since it incorrectly perceives a commented first-line as being an empty line
		"dot-notation": "off", // disabling this lets us access custom properties on window (dot notation throws TS error, and if this were enabled, you couldn't use bracket notation either)
		"object-curly-newline": "off", // fixes that eslint would complain about vscode's import reformatting, when more than 3 variables were imported from a single file
		"import/no-useless-path-segments": "off", // disabled because vs-code's auto-import tool doesn't always write paths matching eslint's "fewest segments" criteria

		// rule disablings
		"no-tabs": 0,
		"max-len": "off",
		"lines-between-class-members": "off",
		"import/prefer-default-export": "off",
		"no-param-reassign": "off",
		"camelcase": "off",
		"no-underscore-dangle": "off",
		"no-continue": "off",
		"no-console": "off", // lets us use console.log, etc.
		"object-property-newline": "off",
		"arrow-body-style": "off",
		"no-await-in-loop": "off",
		"func-names": "off",
		"no-floating-decimal": "off",
		"no-return-assign": "off",
		"no-use-before-define": "off",
		"spaced-comment": "off",
		"eqeqeq": "off",
		"no-var": 0,
		"vars-on-top": 0,
		"no-unused-vars": "off",
		"no-plusplus": "off",
		"sort-imports": "off", // there are a couple places (eg Main_Hot.tsx) where changing the import order will cause errors
		"class-methods-use-this": "off", // class-methods do not need to "use this" to be valid/useful -- for example: React's componentDidMount
		"no-undef": "off", // handled by typescript
		//"react/react-in-jsx-scope": "off", // React is added as a global in my projects
		"no-empty-pattern": "off",
		"no-alert": "off",
		"no-restricted-globals": "off",
		"radix": "off",
		//"no-use-before-define": [1, { "functions": false, "classes": false }],
		"no-use-before-define": "off",
		"react/jsx-indent": "off",
		"react/display-name": "off",
		"no-nested-ternary": "off",
		"operator-linebreak": "off",
		"no-debugger": "off",
		"consistent-return": "off",
		"no-empty": "off",
		"no-trailing-spaces": "off",

		// customizations
		// only apply indent rules for the normal node-types: statements, expressions, etc. (this lets me use my special indenting for JSX)
		"indent": [2, "tab", {
			"flatTernaryExpressions": true,
			"ignoredNodes": [":not(:statement):not(:expression):not(:declaration):not(:function):not(:pattern)"]
		}],
		"import/no-extraneous-dependencies": [1, {"devDependencies": true}],
		"no-restricted-syntax": [0, "ForOfStatement"], // allow for-of loops for now
		"object-curly-spacing": [1, "never"],
		"eol-last": [1, "never"],
		"space-before-function-paren": [1, "never"],
		"quotes": [1, "double"],
		"arrow-spacing": [1, {"before": false, "after": false}],
		"arrow-parens": [1, "as-needed"],
	},
	/*globals: {
		ENV: true,
		ENV_SHORT: true,
		DEV: true,
		PROD: true,
		TEST: true,

		window: true,
		document: true,

		React: true,
		State: true,
		Assert: true,
		Log: true,
		store: true,
		ToJSON: true,
		FromJSON: true,
	},*/
	globals: {
		React: true,
	},
};