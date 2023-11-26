import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	// 为什么updateQueue中的数据结构是shared.pending?
	// 为了让wip和current共用同一个UpdateQueue
	shared: {
		pending: Update<State> | null;
	};
	// 兼容hooks
	dispatch: Dispatch<State> | null;
}

export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};

export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		},
		dispatch: null
	} as UpdateQueue<State>;
};

// 将update加入到updateQueue
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update;
};

// updateQueue消费update的方法
export const processUpdateQueue = <State>(
	baseState: State, // 先前的状态
	pendingUpdate: Update<State> | null // 传入的新状态
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};

	if (pendingUpdate !== null) {
		const action = pendingUpdate.action;
		if (action instanceof Function) {
			// baseState:1 , update (x) => 4x -> memoizedState 4
			// 传入的action是函数的情况
			result.memoizedState = action(baseState);
		} else {
			// baseState:1 update 2 => memoizedState 2
			result.memoizedState = action;
		}
	}

	return result;
};
