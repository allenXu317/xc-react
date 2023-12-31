export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElementType {
	$$typeof: symbol | number;
	type: ElementType;
	key: Key;
	props: Props;
	ref: Ref;
	__mark: string;
}

//对于this.setState需要兼容两种情况:
// 1. this.setState({xxx:1}) - 直接传值
// 2. this.setState((x) => y) - 传入函数
export type Action<State> = State | ((prevState: State) => State);
