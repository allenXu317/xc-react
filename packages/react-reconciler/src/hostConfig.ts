// 宿主环境相关的实现
export type Container = any;

// 模拟实现创建host component
export const createInstance = (...args: any) => {
	return {} as any;
};

// 模拟插入节点
export const appendInitialChild = (...args: any) => {
	return {} as any;
};

// 模拟实现Host Text
export const createTextInstance = (...args: any) => {
	return {} as any;
};

export const appendChildToContainer = (...args: any) => {
	return {} as any;
};
