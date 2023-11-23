// 递归中的递阶段

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
import { renderWithHooks } from './fiberHooks';

export const beginWork = (wip: FiberNode) => {
	// 比较，返回子fiber node
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			// 叶子节点，没有子节点
			return null;
		// 支持FC类型组件
		case FunctionComponent:
			return updateFunctionComponent(wip);
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
			break;
	}
};

// 处理函数组件
function updateFunctionComponent(wip: FiberNode) {
	const nextChildren = renderWithHooks(wip);
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

// 1. 计算状态的最新值
// 2. 创造子fiberNode
function updateHostRoot(wip: FiberNode) {
	// 计算过程实际上是封装在processUpdateQueue中的
	// 计算的baseState,在首屏渲染时为空
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	// 获取最新状态
	// 对于首屏渲染来说，这个memoizedState不是一个function，那么就是一个action
	// 实际上就是一个react element
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	const nextChildren = wip.memoizedState;
	// 通过对比子React element 与 子current fiber node 来标记变化的操作
	// wip.alternate.child -> current.child  -> 子节点的current fiber node
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

// 与updateHostRoot的区别:
// 不会触发更新
function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	// 对比的是子节点的 current.fiberNode 和 子节点的 reactElement
	// 生成子节点对应的 wip FiberNode
	const current = wip.alternate; // 当前节点，还不是子节点

	// 性能优化：
	// 在内存中构建好一颗dom，构建好以后直接替换即可。
	// 这个优化只针对mount阶段，因为mount阶段存在更新大量节点的情况
	// update的时候只更新局部的节点
	if (current !== null) {
		// update
		// 追踪副作用
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount
		// 不追踪副作用
		wip.child = mountChildFibers(wip, null, children);
	}
}
