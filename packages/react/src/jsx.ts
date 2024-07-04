import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import {
	ElementType,
	Key,
	Props,
	ReactElementType,
	Ref,
	Type
} from "shared/ReactTypes";

// React Element
// 与宿主环境无关
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: "xk" // 为了与真实 react 区分开添加的字段
	};
	return element;
};

export const jsx = function (
	type: ElementType,
	config: any,
	...maybeChildren: any
) {
	// config 中 key 和 ref 要单独处理
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	for (let prop in config) {
		const val = config[prop];
		if (prop === "key") {
			if (val !== undefined) {
				// key 转成字符串
				key = "" + val;
			}
			continue;
		}
		if (prop === "ref") {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		// 判断 prop 是否是 config 自己的属性
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength > 0) {
		// children 有两种情况
		// 1. 只有一个子元素 child，解构赋值给 children 属性
		// 2. 有多个子元素 [child, child, child]，赋值给 children 属性
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}

	return ReactElement(type, key, ref, props);
};

export const jsxDEV = function (type: ElementType, config: any) {
	// config 中 key 和 ref 要单独处理
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};

	for (let prop in config) {
		const val = config[prop];
		if (prop === "key") {
			if (val !== undefined) {
				// key 转成字符串
				key = "" + val;
			}
			continue;
		}
		if (prop === "ref") {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		// 判断 prop 是否是 config 自己的属性
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

	return ReactElement(type, key, ref, props);
};
