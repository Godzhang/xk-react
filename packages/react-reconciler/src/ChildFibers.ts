import { ReactElementType } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import {
	FunctionComponent,
	HostComponent,
	HostText,
	WorkTag
} from "./workTags";
import { Placement } from "./fiberFlags";

// ?? mount阶段，有大量DOM需要插入，shouldTrachEffects 应设为 false，不追踪副作用
export function ChildReconciler(shouldTrachEffects: boolean) {
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild: ReactElementType
	) {
		// 根据 element 创建 fiber
		const fiber = createFiberFromElement(newChild);
		fiber.return = returnFiber;
		return fiber;
	}

	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(
			HostText,
			{
				content
			},
			null
		);
		fiber.return = returnFiber;
		return fiber;
	}

	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrachEffects && fiber.alternate === null) {
			// 首屏渲染
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		// 判断当前 fiber 的类型
		if (typeof newChild === "object" && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn("未实现的 reconcile 类型", newChild);
					}
					break;
			}
		}
		// TODO: 多节点的情况 ul > li*3

		// HostText
		if (typeof newChild === "string" || typeof newChild === "number") {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		if (__DEV__) {
			console.warn("未实现的 reconcile 类型", newChild);
		}

		return null;
	};
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);

export function createFiberFromElement(element: ReactElementType): FiberNode {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === "string") {
		// <div></div> type: 'div'
		fiberTag = HostComponent;
	} else if (typeof type !== "function" && __DEV__) {
		console.warn(`未定义的 type 类型`, element);
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
