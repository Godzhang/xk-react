import {
	getPackageJSON,
	resolvePkgPath,
	getBaseRollupPlugins
} from "./utils.js";
import generatePackageJson from "rollup-plugin-generate-package-json";
import alias from "@rollup/plugin-alias";

const { name, module } = getPackageJSON("react-dom");
// react-dom 包的路径
const pkgPath = resolvePkgPath(name);
// react-dom 产物路径
const pkgDistPath = resolvePkgPath(name, true);

export default [
	// React-dom 包
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: "index.js",
				format: "umd"
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: "client.js",
				format: "umd"
			}
		],
		plugins: [
			...getBaseRollupPlugins(),
			// webpack resolve alias
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				inputFolder: pkgPath,
				outputFolder: pkgDistPath,
				baseContents: ({ name, description, version }) => ({
					name,
					description,
					version,
					peerDependencies: {
						react: version
					},
					main: "index.js"
				})
			})
		]
	}
];
