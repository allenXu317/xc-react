// 宿主环境相关的实现
// react-dom 代表了浏览器宿主环境
export type Container = Element;
export type Instance = Element;

// 模拟实现创建host component
export const createInstance = (type: string, props: any): Instance => {
	// TODO 处理props
	const element = document.createElement(type);

	return element;
};

// 模拟插入节点
export const appendInitialChild = (parent: Instance, child: Instance) => {
	parent.appendChild(child);
};

// 模拟实现Host Text
export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};

export const appendChildToContainer = appendInitialChild;
