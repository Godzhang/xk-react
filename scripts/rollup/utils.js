import path from "path";
import fs from "fs";
import ts from "rollup-plugin-typescript2";
import cjs from "@rollup/plugin-commonjs";

const pkgPath = path.resolve(__dirname, "../../packages");
const distPath = path.resolve(__dirname, "../../dist/node_modules");

/**
 * 解析包名
 * @param {string} pkgName 包名
 * @param {boolean} isDist 是否是打包后的路径
 * @returns {string} 包路径
 */
export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
}

/**
 * 获取包的 package.json 内容
 * @param {string} pkgName
 */
export function getPackageJSON(pkgName) {
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: "utf-8" });
	return JSON.parse(str);
}

/**
 * 获取所有基础的 rollup 插件
 */
export function getBaseRollupPlugins({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)];
}
