import {
	getPackageJSON,
	resolvePkgPath,
	getBaseRollupPlugins
} from "./utils.js";
import generatePackageJson from "rollup-plugin-generate-package-json";

const { name, module } = getPackageJSON("react");
// react 包的路径
const pkgPath = resolvePkgPath(name);
// react 产物路径
const pkgDistPath = resolvePkgPath(name, true);

export default [
	// React 包
	{
		input: `${pkgPath}/${module}`,
		output: {
			file: `${pkgDistPath}/index.js`,
			name: "react",
			format: "umd"
		},
		plugins: [
			...getBaseRollupPlugins(),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					main: "index.js"
				})
			})
		]
	},
	// jsx-runtime
	{
		input: `${pkgPath}/src/jsx.ts`,
		output: [
			// jsx-runtime
			{
				file: `${pkgDistPath}/jsx-runtime.js`,
				name: "jsx-runtime.js",
				format: "umd"
			},
			// jsx-dev-runtime
			{
				file: `${pkgDistPath}/jsx-dev-runtime.js`,
				name: "jsx-dev-runtime.js",
				format: "umd"
			}
		],
		plugins: getBaseRollupPlugins()
	}
];
