// 递归中的归

import {
	Container,
	Instance,
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'hostConfig';
import { FiberNode } from './fiber';
import { HostComponent, HostRoot, HostText } from './workTags';
import { NoFlags } from './fiberFlags';

export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate; // wip对应的已经被渲染的节点

	switch (wip.tag) {
		case HostComponent:
			// 构建离屏的dom树:

			// 先判断当前是 mount 还是 update
			if (current !== null && wip.stateNode) {
				// 对于HostComponent来说，wip.stateNode实际上保存的是dom节点
				// update
			} else {
				// mount流程
				// 1. 构建dom
				const instance = createInstance(wip.type, newProps); // 宿主环境的实例，对浏览器来说就是dom
				// 2. 将DOM插入到DOM树中
				console.log('---instance---', instance);

				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;

		case HostText:
			if (current !== null && wip.stateNode) {
				// 对于HostComponent来说，wip.stateNode实际上保存的是dom节点
				// update
			} else {
				// mount流程
				// 1. 构建dom
				// text不存在child，不需要遍历查找
				const instance = createTextInstance(newProps.content); // 宿主环境的text实例，对浏览器来说就是dom
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;

		case HostRoot:
			bubbleProperties(wip);
			return null;

		default:
			if (__DEV__) {
				console.warn('未处理的completeWork情况', wip);
			}
			break;
	}
};

// 实现难点：需要将 类 或者 函数组件 最后真正的dom节点插入到父dom节点中
// 插入节点的过程
// 希望在parent节点下，插入wip节点
function appendAllChildren(parent: Instance, wip: FiberNode) {
	let node = wip.child;

	// wip可能不是一个dom节点，所以需要进行递归查找里面的Hostxxx类型的节点
	// 需要进行递归查找
	while (node !== null) {
		if (node && (node.tag === HostComponent || node.tag === HostText)) {
			// 如果找到了，就进行append插入操作
			// 否则，就继续递归
			console.log('----', node, parent);

			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			// 找子节点
			node.child.return = node;
			node = node.child;
			continue;
		}

		// 终止条件
		if (node === wip) {
			return;
		}

		// 找兄弟节点
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

// 性能优化
// 利用completeWork归的过程，将flags冒泡到上面
// 通过completeWork完成了这个归的过程，那么最后通过这颗fiber树的根节点就可以知道当前是不是需要对节点进行操作；
// 同时，当在根节点知道这颗fiber树需要进行更新时，就会向下遍历，看看哪个节点的子树需要遍历；
// 然后找到具体的节点
function bubbleProperties(completeWork: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = completeWork.child;

	while (child !== null) {
		// 位或操作获取子节点的flag
		subtreeFlags |= child.subtreeFlags;
		// 同时位或操作获取自己的flag
		subtreeFlags |= child.flags;

		// 继续遍历
		child.return = completeWork;
		child = child.sibling;
	}

	completeWork.subtreeFlags |= subtreeFlags;
}
