// 比如，当调用了ReactDOM.createRoot方法以后，

import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate
} from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

//createRoot方法内部会调用createContainer
// mount的时候调用
export function createContainer(container: Container): FiberRootNode {
	// container是createRoot传入的dom节点：
	const hostRootFiber = new FiberNode(HostRoot, {}, null);
	hostRootFiber.updateQueue = createUpdateQueue();

	// 创建FiberRootNode，并且与hostRootFiber产生关联
	const root = new FiberRootNode(container, hostRootFiber);

	return root;
}

// render方法调用
// render方法传入的是一个组件，就是reactElement
// mount的时候调用
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	const hostRootFiber = root.current;
	// 首屏渲染，触发更新
	// 将element构造成一个Update,表明这个update就与这个element绑定了
	// 这样后续beginWork和completeWork就可以根据element进行更新
	const update = createUpdate<ReactElementType | null>(element);
	// 将update插入到hostRootFiber的updateQueue中:
	// 接入到更新机制中
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	);

	// 将updateFiber 和 workLoop关联上
	scheduleUpdateOnFiber(hostRootFiber);

	return element;
}
