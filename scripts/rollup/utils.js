import path from 'path';
import fs from 'fs';

// 引入 plugin
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
// 引入replace
import replace from '@rollup/plugin-replace';

const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

export function resolvePkgPath(pkgName, isDist) {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
}

export function getPackageJSON(pkgName) {
	// ...包路径
	const path = `${resolvePkgPath(pkgName)}/package.json`;
	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(str);
}

export function getBaseRollupPlugins(
	alias = { __DEV__: true, preventAssignment: true },
	typescript = {}
) {
	// 用于解析commonjs的plugin  pnpm i -D -w @rollup/plugin-commonjs
	// 用于解析ts代码的plugin pnpm i -D -w rollup-plugin-typescript2

	return [replace(alias), cjs(), ts(typescript)];
}
