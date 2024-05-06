import { Key, Props, Ref } from "shared/ReactTypes";
import { WorkTag } from "./workTags";
import { Flags, NoFlags } from "./fiberFlags";
import { Container } from "hostConfig";
import { UpdateQueue } from "./updateQueue";

/**
 * VDOM Fiber Node
 */
export class FiberNode {
	type: any;
	tag: WorkTag;
	pendingProps: Props;
	key: Key;
	stateNode: any;

	return: FiberNode | null;
	child: FiberNode | null;
	sibling: FiberNode | null;
	index: number;
	ref: Ref;

	memoizeProps: Props | null;
	memoizeState: any;
	updateQueue: unknown;
	alternate: FiberNode | null; // current <-> WorkInProgress (互相指向)
	flags: Flags; // 保存对应的标记

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		// 例如 HostCompoent <div> 保存的是div的DOM
		this.stateNode = null;
		// 例如 FunctionComponent 保存的是 () => {}
		this.type = null;

		// 表示节点关系的字段，构成树状结构
		this.return = null; /* 父fiberNode */
		this.child = null; /* 子fiberNode */
		this.sibling = null; /* 兄弟fiberNode */
		this.index = 0; /* 节点在兄弟节点中的位置 */

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps; // 初始 props
		this.memoizeProps = null; // 确定之后的 props
		this.memoizeState = null; // 确定之后的 props
		this.updateQueue = null;

		this.alternate = null;
		this.flags = NoFlags; // 副作用
	}
}

// ReactDOM.createRoot(container).render(<App />);
// FiberRootNode -> createRoot
// HostRootFiber -> container
// App -> <App />

export class FiberRootNode {
	// 由于宿主环境不同，这里不能设置为 Element
	container: Container;
	current: FiberNode;
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
	let wip = current.alternate;

	// 首屏渲染 wip 会是 null
	if (wip === null) {
		// mount 创建一个新的 FiberNode
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags; // 清除副作用
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizeProps = current.memoizeProps;
	wip.memoizeState = current.memoizeState;

	return wip as FiberNode;
};
