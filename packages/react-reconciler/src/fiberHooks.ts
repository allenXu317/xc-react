import internals from 'shared/internals';
import { FiberNode } from './fiber';
import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

// 当前正在render的fiber
// 为hooks服务
let currentlyRenderingFiber: FiberNode | null = null;
// 指向当前fiber正在处理的hook
let workInProgressHook: Hook | null = null;

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
	// 重置
	wip.memoizedState = null;

	// 判断两个时机: mount & update
	const current = wip.alternate;

	if (current !== null) {
		// update
	} else {
		// mount
		currentDispatcher.current = HooksDispatcherOnMount;
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

// mount阶段的hooks集合
const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

// mount阶段useState的实现
function mountState<State>(
	initialState: (() => State) | State
): [State, Dispatch<State>] {
	// 找到当前useState对应的hook数据
	const hook = mountWorkInProgressHook();
	let memoizedState;

	if (initialState instanceof Function) {
		memoizedState = initialState();
	} else {
		memoizedState = initialState;
	}

	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;

	const dispatch = dispatchSetState.bind(
		null,
		currentlyRenderingFiber as FiberNode,
		queue
	); // useState脱离函数组件也可以使用:window.setState = setState..
	queue.dispatch = dispatch;
	return [memoizedState, dispatch];
}

function dispatchSetState(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	// 与首屏渲染的更新流程差不多
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber); // fiber: function component 触发的更新
}

// 获取当前useState对应的hook数据
function mountWorkInProgressHook(): Hook {
	// 对于mount，首先创建hook
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};
	if (workInProgressHook === null) {
		// mount时 第一个hook
		// 相当于hook链表的第一个节点
		if (currentlyRenderingFiber === null) {
			// 这种情况代表了没在一个函数组件内执行useState
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
	} else {
		// mount 时后续的hook
		// 相当于hook链表后续的节点
		workInProgressHook.next = hook; // 链表链接后一个节点
		workInProgressHook = hook; // 链表移动
	}

	return workInProgressHook;
}
