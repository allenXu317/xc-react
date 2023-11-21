// 完整的工作循环
// 调用beginWork 和 completeWork

import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

function prepareRefreshStack(root: FiberRootNode) {
	// FiberRootNode 不是一个普通的fiber，不能直接拿来当WIP
	// 创建WIP
	workInProgress = createWorkInProgress(root.current, {});
}

// 将 container 和 renderRoot方法进行连接
// TODO: 在fiber中调度update
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 对于首屏渲染，传入的是hostRootFiber
	// 但是对于更新，传入的ClassFiber或者FunctionFiber
	// 为了统一，需要从当前的Fiber一直向上遍历到根节点：
	const root = markUpdateFromFiberToRoot(fiber) as FiberRootNode;
	renderRoot(root);
}

// 接受当前的fiber，并且向上遍历到根节点
function markUpdateFromFiberToRoot(fiber: FiberNode): FiberRootNode | null {
	let node = fiber;
	let parent = node.return;
	// 当parent不为null的时候，说明这是一个普通的fiber节点
	// 否则就是一个hostRootFiber节点
	// hostRootFiber节点的父节点是通过stateNode去找到的
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.type === HostRoot) {
		return node.stateNode;
	}
	return null;
}

function renderRoot(root: FiberRootNode) {
	// 初始化 - 让workInProgress指向遍历的第一个fiber node - 也就是fiber root node
	prepareRefreshStack(root);

	// 执行递归的流程
	do {
		try {
			workLoop();
			break;
		} catch (error) {
			if (__DEV__) {
				console.warn('workLoop发生错误', error);
			}
			workInProgress = null;
		}
	} while (true);

	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;

	// wip fiberNode树
	// 通过commitRoot来提交渲染
	// commitRoot(root);
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}

function performUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	// 在beginWork中还需要对fiber.pendingProps进行处理
	// 处理完之后pendingProps就有最终形态了，相当于memoizedProps
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		// 遍历完毕
		completeUnitOfWork(fiber);
	} else {
		// 继续遍历
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	// 找兄弟节点
	do {
		completeWork(node);
		const sibling = node.sibling;

		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node && node.return;

		workInProgress = node;
	} while (node !== null);
}
