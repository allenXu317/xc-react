import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { FLags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	memoizedProps: Props | null;
	memoizedState: any;

	alternate: FiberNode | null;

	// 操作
	flags: FLags;

	// 更新队列
	updateQueue: unknown;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		// 表示节点本身
		this.tag = tag;
		this.key = key;
		// HostComponent <div> -> div DOM
		this.stateNode = null;
		// 对于FunctionComponent来说，就是function本身
		this.type = null;

		// 表示节点之间的关系
		// 构成树状结构
		this.return = null; // 指向父节点
		this.sibling = null; // 指向兄弟节点
		this.child = null; // 孩子节点
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps; // 刚开始工作的属性
		this.memoizedProps = null; // 工作完以后确定的属性
		this.memoizedState = null;
		this.updateQueue = null;

		// 切换WIP和current
		this.alternate = null;

		// 副作用
		// 操作标记
		this.flags = NoFlags;
	}
}

// 根节点fiber
export class FiberRootNode {
	// 与宿主环境有关
	// 例如在浏览器中，就是一个dom元素，在其他的宿主环境中，就是其他的元素
	container: Container;
	// 当前指向HostRootFiber
	current: FiberNode;
	// 更新完成以后的HostRootFiber
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	// 双缓存机制
	// 传入一个FiberNode,传出的应该是他的alternate
	// 每次都获取跟我相对应的fiberNode
	let wip = current.alternate as FiberNode;

	if (wip === null) {
		// mount - 该节点第一次渲染
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// 更新
		// update - 该节点进行更新
		// 只更新这个节点wip
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
	}
	wip.updateQueue = current.updateQueue;
	wip.type = current.type;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
};
