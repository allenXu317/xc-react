import internals from 'shared/internals';
import { FiberNode } from './fiber';

// 当前正在render的fiber
// 为hooks服务
let currentlyRenderingFiber: FiberNode | null = null;
// 指向当前fiber正在处理的hook
const workInProgressHook: Hook | null = null;

const { currentDispatcher } = internals;

// 定义hooks的数据结构
// 首先这是一个通用的数据结构，要满足所有hooks的使用
interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null; // Hook 链表的下一个节点
}

export function renderWithHooks(wip: FiberNode) {
	// 赋值操作
	currentlyRenderingFiber = wip;
	wip.memoizedState = null;

	// 判断两个时机: mount & update
	const current = wip.alternate;

	if (current !== null) {
		// update
	} else {
		// mount
		currentDispatcher.current = null;
	}

	// 获取函数组件的函数
	const Component = wip.type;
	const props = wip.pendingProps;
	// 执行函数组件的函数，获取函数组件中return的jsx
	const children = Component(props);

	// 重置操作
	currentlyRenderingFiber = null;
	return children;
}
