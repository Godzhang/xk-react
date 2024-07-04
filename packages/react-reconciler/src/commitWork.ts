import { Container, appendChildToContainer } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import {
	ChildDeletion,
	MutationMask,
	NoFlags,
	Placement,
	Update
} from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	while (nextEffect !== null) {
		// 向下遍历
		const child: FiberNode | null = nextEffect.child;

		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			nextEffect = child;
		} else {
			// 向上遍历 DFS
			up: while (nextEffect !== null) {
				commitMutationEffectOnFiber(nextEffect);
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

const commitMutationEffectOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;
	// 插入操作
	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}
	// 更新操作
	// if ((flags & Update) !== NoFlags) {
	// 	commitUpdate(finishedWork);
	// 	finishedWork.flags &= ~Update;
	// }
	// 删除操作
	// if ((flags & ChildDeletion) !== NoFlags) {
	// 	commitChildDeletion(finishedWork);
	// 	finishedWork.flags &= ~ChildDeletion;
	// }
};

const commitPlacement = (finishedWork: FiberNode) => {
	if (__DEV__) {
		console.warn("执行 Placement 操作", finishedWork);
	}
	// 找到父节点 dom
	const hostParent = getHostParent(finishedWork);
	// 还有 finishedWork 的 dom，将 dom 添加到 parent
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
};

// 获取宿主环境父节点
function getHostParent(fiber: FiberNode): Container | null {
	let parent = fiber.return;

	while (parent) {
		const parentTag = parent.tag;

		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		parent = parent.return;
	}
	1; // 如果没找到
	if (__DEV__) {
		console.warn("未找到 host parent");
	}
	return null;
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	// fiber host
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(hostParent, finishedWork.stateNode);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);

		let sibiling = child.sibling;
		while (sibiling !== null) {
			appendPlacementNodeIntoContainer(sibiling, hostParent);
			sibiling = sibiling.sibling;
		}
	}
}
