// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import airbnbBase from "eslint-config-airbnb-base";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import * as pluginImport from "eslint-plugin-import";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import {createRequire} from 'module';
import "eslint-plugin-only-warn"; // for this one, simply importing it is enough to activate it
import {fileURLToPath} from 'node:url';
import eslintJs from "@eslint/js";
import path from 'path';

// TODO:
// * Integrate eslint-config-airbnb-base again, once it works with eslint v9: https://github.com/airbnb/javascript/issues/2961 

// helper for legacy plugins
// from: https://github.com/import-js/eslint-plugin-import/issues/2948#issuecomment-2148832701
// ==========

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: eslintJs.configs.recommended,
});
/**
 * @param {string} name the plugin name
 * @param {string} alias the plugin alias
 * @returns {import("eslint").ESLint.Plugin}
 */
function legacyPlugin(name, alias = name) {
	const plugin = compat.plugins(name)[0]?.plugins?.[alias];
	if (!plugin) {
	  throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
	}

	return fixupPluginRules(/** @type {any} */ (plugin));
}
// custom added; commented; didn't seem to work, as written
/*/**
 * @param {string} name the config name
 * @returns {import("eslint").Linter.Config[]}
 *#/
function legacyConfig(name) {
	const config = compat.config(name)[0];
	if (!config) {
	  throw new Error(`Unable to resolve config ${name}`);
	}
	return fixupConfigRules(/** @type {any} *#/ (config));
}*/

// main
// ==========

const require = createRequire(import.meta.url);

/** @typedef {import("typescript-eslint").ConfigWithExtends} Config */
/** @typedef {import("eslint").Rule.RuleModule} RuleModule */
///** @typedef {import("@typescript-eslint/utils").SharedConfig} SharedConfig */

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,

	//airbnbBase,
	/*...[
		require("eslint-config-airbnb-base/rules/best-practices"),
		require("eslint-config-airbnb-base/rules/errors"),
		require("eslint-config-airbnb-base/rules/node"),
		require("eslint-config-airbnb-base/rules/style"),
		require("eslint-config-airbnb-base/rules/variables"),
		require("eslint-config-airbnb-base/rules/es6"),
		require("eslint-config-airbnb-base/rules/imports"),
		require("eslint-config-airbnb-base/rules/strict"),
	],*/
	//...legacyConfig("eslint-config-airbnb-base"),
	//...compat.extends("eslint-config-airbnb-base"),

	/*...[
		fixupPluginsAndRules(pluginImport.flatConfigs?.recommended),
		// commented these, since they end up empty at runtime fsr (even though inspecting file shows exports)
		///** @type {Config} *#/ fixupPluginsAndRules(pluginImport.flatConfigs?.react),
		///** @type {Config} *#/ fixupPluginsAndRules(pluginImport.flatConfigs?.typescript),
	],*/
	// legacy plugins
	{
		plugins: {
			import: legacyPlugin("eslint-plugin-import", "import"),
		},
	},

	pluginReact.configs.flat.recommended,
	// somewhat based on: https://github.com/eslint/rewrite/tree/main/packages/compat#fixing-plugins
	{
		plugins: {"react-hooks": fixupPluginRules({rules: /** @type {Record<String, RuleModule>} */ (pluginReactHooks.rules)})},
		rules: /** @type {any} */ (pluginReactHooks.configs.recommended.rules),
	},

	{
		/*parser: "@typescript-eslint/parser",
		parserOptions: {
			ecmaVersion: 8,
			sourceType: "module",
			ecmaFeatures: {
				jsx: true,
				modules: true,
				//legacyDecorators: true,
			}
		},*/
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
		/*env: {
			"browser": true,
			"commonjs": true,
			"es6": true,
			"node": true
		},*/
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
			"spaced-comment": "off",
			"eqeqeq": "off",
			"no-var": "off",
			"vars-on-top": "off",
			"no-unused-vars": "off",
			"no-plusplus": "off",
			"class-methods-use-this": "off", // class-methods do not need to "use this" to be valid/useful -- for example: React's componentDidMount
			"no-undef": "off", // handled by typescript
			"no-empty-pattern": "off",
			"no-alert": "off",
			"no-restricted-globals": "off",
			"radix": "off",
			//"no-use-before-define": [1, { "functions": false, "classes": false }],
			"no-use-before-define": "off",
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
			"key-spacing": "off",

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

			//"react/react-in-jsx-scope": "off", // React is added as a global in my projects
			"react/jsx-indent": "off",
			"react/display-name": "off",
			"react/prop-types": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": ["warn", {"additionalHooks": "(Use(Memo|Callback|Effect)|Watch)"}],
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
		/*globals: {
			React: true,
		},*/
	},
);