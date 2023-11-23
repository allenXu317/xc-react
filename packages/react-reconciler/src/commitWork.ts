import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

// 指向下一个需要执行的effect
let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	while (nextEffect !== null) {
		const child: FiberNode | null = nextEffect.child;

		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			// 向下遍历
			nextEffect = child;
		} else {
			// 当子节点不包含subtreeFlags时，有可能包含flags，那么网上遍历;
			// 实际上就是个DFS，先往下遍历到符合条件的最深的节点，再往上遍历;
			up: while (nextEffect !== null) {
				commitMutationEffectsOnFiber(nextEffect);
				const sibling: FiberNode | null = nextEffect.sibling;

				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;

	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);

		finishedWork.flags &= ~Placement; // 删除Placement flag
	}
};

const commitPlacement = (finishedWork: FiberNode) => {
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}

	// 获取宿主环境中原生父节点
	const hostParent = getHostParent(finishedWork);
	// 找到finishedWork对应的dom，并将其append到parent中

	appendPlacementNodeIntoContainer(finishedWork, hostParent);
};

function getHostParent(fiber: FiberNode) {
	let parent = fiber.return;

	while (parent) {
		const parentTag = parent.tag;
		// hostcomponent hostroot - 这两种情况下的fiber.tag对应的就是原生节点
		if (parentTag === HostComponent) {
			console.log('!!!!!!');
			return parent.stateNode; // HostComponent 类型的fiber，stateNode获取原生节点
		}
		if (parentTag === HostRoot) {
			console.log('?????');

			return (parent.stateNode as FiberRootNode).container; // HostRoot 类型的fiber，stateNode.container获取原生节点
		}
		// 向上遍历
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('未找到host parent');
	}
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// 传入的finishedWork不一定是host类型的节点
	// 向下遍历，通过传进来的fiber，找到对应的宿主环境的host
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		console.log('=======', finishedWork);

		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	// 向下遍历
	const child = finishedWork.child;
	if (child !== null) {
		console.log('[[[[[[[', hostParent, finishedWork, child);

		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;

		while (sibling !== null) {
			console.log(']]]]]]]]');

			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
