// jsx方法的返回值是一个ReactElement类型的对象
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Key,
	Ref,
	Props,
	ElementType,
	ReactElementType
} from 'shared/ReactTypes';

// type 类型
// key 为组件指定的key
// props: 组件的属性
// ReactElement 是一个与宿主环境无关的数据结构，所以其定义放在shared包中
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element: ReactElementType = {
		// 内部使用的字段，指明当前的对象是一个reactElement
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		// 与真实的react项目进行区分
		__mark: 'xc'
	};

	return element;
};

export const jsx = (
	type: ElementType,
	config: any,
	// 可能传入的一些值
	...maybeChildren: any
) => {
	const props: Props = {};
	// 需要对key和ref这两个prop进行单独处理
	let key: Key = null;
	let ref: Ref = null;

	// 遍历props
	for (const prop in config) {
		const val = config[prop];
		// 对key属性进行特殊处理
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		// 对ref进行特殊处理
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if (Object.hasOwnProperty.call(config, prop)) {
			// 如果是自己的就赋值给prop
			// 原型上的就不赋值给prop
			props[prop] = val;
		}
	}
	// 处理maybeChildren
	const maybeChildrenLength = maybeChildren.length;
	if (maybeChildrenLength) {
		// 分length为1和>1的情况
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0];
		} else {
			props.children = maybeChildren;
		}
	}

	return ReactElement(type, key, ref, props);
};

// jsx 和 jsxDEV 在实现上有不同
// 主要是关于 maybeChildren 参数的不同
export const jsxDEV = (type: ElementType, config: any) => {
	const props: Props = {};
	// 需要对key和ref这两个prop进行单独处理
	let key: Key = null;
	let ref: Ref = null;

	// 遍历props
	for (const prop in config) {
		const val = config[prop];
		// 对key属性进行特殊处理
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		// 对ref进行特殊处理
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if (Object.hasOwnProperty.call(config, prop)) {
			// 如果是自己的就赋值给prop
			// 原型上的就不赋值给prop
			props[prop] = val;
		}
	}
	return ReactElement(type, key, ref, props);
};
