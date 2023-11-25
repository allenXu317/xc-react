// React包
import { Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import currentDispatcher from './src/currentDispatcher';
import { jsxDEV } from './src/jsx';

// 暴露hooks
export const useState: Dispatcher['useState'] = (initialState: any) => {
	// 获取dispatcher中的useState
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};

// 内部数据共享层
export const __INTERNAL_DATA_SHARED__ = {
	currentDispatcher
};

export default {
	version: '0.0.0',
	createElement: jsxDEV
};
