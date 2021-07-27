module.exports = {
	extends: [
		"airbnb-base",
		"plugin:react/recommended",
		//"plugin:jsx-a11y/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 8,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
			modules: true,
			//legacyDecorators: true,
		}
	},
	plugins: [
		"@typescript-eslint",
		"import",
		"react",
		"react-hooks",
		//"jsx-a11y", // warns about accessibility concerns
		//"babel",
		"only-warn",
	],
	settings: {
		"import/resolver": {
			node: {
				// see: https://www.npmjs.com/package/eslint-import-resolver-node ("an array of absolute paths which will also be searched; think NODE_PATH")
				//paths: ["Source"],
				extensions: [
					".js",
					".jsx",
					".ts",
					".tsx",
				],
			},
			//typescript: {}, // enable usage of eslint-import-resolver-typescript
		},
		"react": {
			"version": "detect", // to avoid warning
		},
	},
	env: {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"node": true
	},
	rules: {
		// fixes (eg. rule disablings due to detection not working properly)
		// ==========

		"strict": [1, "never"], // fix for extraneous (and incorrect) entry for "strict" rule in airbnb-base/index.js
		"padded-blocks": "off", // disabled since it incorrectly perceives a commented first-line as being an empty line
		"dot-notation": "off", // disabling this lets us access custom properties on window (dot notation throws TS error, and if this were enabled, you couldn't use bracket notation either)
		"object-curly-newline": "off", // fixes that eslint would complain about vscode's import reformatting, when more than 3 variables were imported from a single file
		"import/no-useless-path-segments": "off", // disabled because vs-code's auto-import tool doesn't always write paths matching eslint's "fewest segments" criteria
		"no-useless-constructor": "off", // fixes lint-parser bug for constructor-overloads
		"no-dupe-class-members": "off", // fixes eslint thinking ts method-overloads are duplicate members
		// fixes that airbnb-base restricts extensions to js files
		"import/extensions": ["error", "ignorePackages"],
		// disabled for now, since some repos (eg. libs) use ".js", whereas others (eg. websites) use no-extension
		//"import/extensions": "off",
		// disabled for now, since I couldn't get eslint-import-resolver-typescript to work (to resolve ".js"-not-resolving-to-ts issue) [it's not that useful anyway; TS generally tells of missing files]
		"import/no-unresolved": "off",
		"prefer-destructuring": "off", // too many false positives (eg. vars *meant* as single-field access/alias)
		"import/no-extraneous-dependencies": "off", // too many false-positives (eg. for monorepo setup in dm repo)
		"sort-imports": "off", // there are a couple places (eg Main_Hot.tsx) where changing the import order will cause errors
		"import/export": "off", // it thinks TS func-overloads are multiple exports
		"no-redeclare": "off", // it thinks TS func-overloads are redeclares
		"no-shadow": "off", // it thinks TS enums shadow themselves
      "@typescript-eslint/no-shadow": ["warn"], // use the ts-specific rule instead

		// rule disablings (for preferences)
		// ==========

		"no-tabs": "off",
		"max-len": "off",
		"lines-between-class-members": "off",
		"import/prefer-default-export": "off",
		"import/no-mutable-exports": "off",
		"import/newline-after-import": "off", // sometimes an import statement is desired next to runtime code, for clarity
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
		"no-var": "off",
		"vars-on-top": "off",
		"no-unused-vars": "off",
		"no-plusplus": "off",
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
		//"no-trailing-spaces": "off",
		"no-lonely-if": "off",
		"newline-per-chained-call": "off",
		"one-var": "off",
		"one-var-declaration-per-line": "off",
		"no-inner-declarations": "off",
		"no-void": "off",
		// "return await SomeAsyncFunc()" can be useful: returning a promise effectively "awaits" it, so being able to add/keep that (unnecessary) "await" keyword makes it explicit.
		//		Doing so makes the visual inspection of return statements consistent with regular function calls: if you don't see the await keyword, we're not "waiting on" that function, to progress to the next line
		"no-return-await": "off",
		"max-classes-per-file": "off",
		"block-scoped-var": "off",
		"no-multi-assign": "off", // limited cases where useful, but still some

		// rule customizations (for preferences)
		// ==========

		// only apply indent rules for the normal node-types: statements, expressions, etc. (this lets me use my special indenting for JSX)
		"indent": [2, "tab", {
			"flatTernaryExpressions": true,
			"ignoredNodes": [":not(:statement):not(:expression):not(:declaration):not(:function):not(:pattern)"]
		}],
		//"import/no-extraneous-dependencies": [1, {"devDependencies": true}],
		"no-restricted-syntax": [0, "ForOfStatement"], // allow for-of loops for now
		"object-curly-spacing": [1, "never"],
		"eol-last": [1, "never"],
		"space-before-function-paren": [1, "never"],
		"quotes": [1, "double", {"avoidEscape": true, "allowTemplateLiterals": true}],
		"arrow-spacing": [1, {"before": false, "after": false}],
		"arrow-parens": [1, "as-needed"],
		"no-trailing-spaces": [1, {"ignoreComments": true}], // needed for markdown line-break controlling in jsdoc comments
		"prefer-const": ["error", {
			"destructuring": "all",
			//"ignoreReadBeforeAssign": false
	 	}],

		// plugins
		// ==========

		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": ["warn", { "additionalHooks": "(Use(Memo|Callback|Effect)|Watch)" }]
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