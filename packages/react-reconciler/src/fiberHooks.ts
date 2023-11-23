import { FiberNode } from './fiber';

export function renderWithHooks(wip: FiberNode) {
	// 获取函数组件的函数
	const Component = wip.type;
	const props = wip.pendingProps;
	// 执行函数组件的函数，获取函数组件中return的jsx
	const children = Component(props);

	return children;
}
