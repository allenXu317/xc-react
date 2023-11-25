// hooks集合
// 各hooks的具体实现在reconciler中
// 希望 reconciler 和 react 解耦，使用shared进行中转
import { Action } from 'shared/ReactTypes';

// hooks的集合
export interface Dispatcher {
	// const [x,setX] = useState(1) => T 传入值，对应的是T
	// const [x,setX] = useState((x) => x+1) => () => T 传入函数，对应的是() => T
	useState: <T>(initialState: (() => T) | T) => [T, Dispatch<T>];
	// useEffect: any;
}

// Dispatch 接受一个状态 Action，这个Action可以是一个值，也可以是改变状态的函数
export type Dispatch<State> = (action: Action<State>) => void;

export const currentDispatcher: { current: Dispatcher | null } = {
	current: null
};

// 获取hook的方法
export const resolveDispatcher = (): Dispatcher => {
	const dispatcher = currentDispatcher.current;

	if (dispatcher === null) {
		// 如果不是在函数组件中，说明dispatcher是没有被赋值的。
		throw new Error('hook 只能在函数组件中执行');
	}

	return dispatcher;
};

export default currentDispatcher;
