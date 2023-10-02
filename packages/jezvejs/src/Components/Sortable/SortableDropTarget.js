import {
    comparePosition,
    insertAfter,
    insertBefore,
    hasFlag,
    isFunction,
    afterTransition,
    transform,
    asArray,
    px,
} from '../../js/common.js';
import { DropTarget } from '../DragnDrop/DropTarget.js';
import { SortableDragAvatar } from './SortableDragAvatar.js';

/* eslint-disable no-bitwise, no-unused-vars */

const defaultProps = {
    group: null,
    tree: false,
    animated: false,
    vertical: true,
    animatedClass: 'animated',
    transitionTimeout: 300,
};

// Sortable drop target
export class SortableDropTarget extends DropTarget {
    constructor(...args) {
        super(...args);

        this.props = {
            ...defaultProps,
            ...this.props,
        };
    }

    getAnimatedClass() {
        return this.props.animatedClass;
    }

    getTransitionTimeout() {
        return this.props.transitionTimeout;
    }

    getTargetElem(avatar, event) {
        let el = avatar.getTargetElem();
        const dragInfo = avatar.getDragInfo();
        const itemSelector = dragInfo.dragZone.getItemSelector();
        const containerSelector = dragInfo.dragZone.getContainerSelector();
        const phItemClass = dragInfo.dragZone.getPlaceholder();
        const root = dragInfo.dragZone.getElement();

        while (el && el !== root && !el.dragZone) {
            if (
                el.matches(itemSelector)
                || el.matches(containerSelector)
                || (el.classList && el.classList.contains(phItemClass))
            ) {
                return el;
            }

            el = el.parentNode;
        }

        return (el?.dragZone) ? el : null;
    }

    /** Returns sortable group */
    getGroup() {
        const group = this.props?.group ?? null;
        return isFunction(group) ? group(this.targetElem) : group;
    }

    onDragMove(avatar, event) {
        const newTargetElem = this.getTargetElem(avatar, event);
        if (this.targetElem === newTargetElem) {
            return;
        }

        this.hideHoverIndication(avatar);
        this.targetElem = newTargetElem;
        this.showHoverIndication(avatar);

        const dragInfo = avatar.getDragInfo();
        const currentGroup = this.getGroup();
        const targetGroup = dragInfo.dragZone.getGroup(dragInfo.dragZoneElem);

        if (
            !this.targetElem
            || !(avatar instanceof SortableDragAvatar)
            || (targetGroup !== currentGroup)
        ) {
            return;
        }

        const nodeCmp = comparePosition(this.targetElem, dragInfo.dragZoneElem);
        if (!nodeCmp) {
            return;
        }

        const dragZoneBeforeTarget = hasFlag(nodeCmp, 2);
        const dragZoneAfterTarget = hasFlag(nodeCmp, 4);
        const dragZoneContainsTarget = hasFlag(nodeCmp, 8);
        const targetContainsDragZone = hasFlag(nodeCmp, 16);
        const itemSelector = dragInfo.dragZone.getItemSelector();
        const containerSelector = dragInfo.dragZone.getContainerSelector();
        const targetContainer = this.targetElem.querySelector(containerSelector);
        let collapsingElem = null;
        let animateElems = [];

        // check drop target is already a placeholder
        if (this.targetElem.classList.contains(dragInfo.dragZone.getPlaceholder())) {
            const pos = avatar.getSortPosition();
            // swap drag zone with drop target
            if (dragZoneBeforeTarget) {
                insertAfter(dragInfo.dragZoneElem, this.targetElem);
            } else if (dragZoneAfterTarget) {
                insertBefore(dragInfo.dragZoneElem, this.targetElem);
            }

            if (this.targetElem !== pos.prev && this.targetElem !== pos.next) {
                if (pos.prev) {
                    insertAfter(this.targetElem, pos.prev);
                } else {
                    insertBefore(this.targetElem, pos.next);
                }
            }
        } else if (
            dragInfo.dragZoneElem.parentNode !== this.targetElem.parentNode
            && !dragZoneContainsTarget
        ) {
            /* move between different containers */
            if (this.targetElem.dragZone && !targetContainsDragZone) {
                collapsingElem = this.createCollapsingElement(dragInfo.dragZoneElem);
                this.targetElem.append(dragInfo.dragZoneElem);
            } else if (
                this.props.tree
                && targetContainsDragZone
                && (this.targetElem.dragZone || this.targetElem.matches(containerSelector))
            ) {
                const parentItem = dragInfo.dragZoneElem.parentNode.closest(itemSelector);
                if (parentItem && parentItem !== this.targetElem) {
                    const rect = parentItem.getBoundingClientRect();
                    if (event.clientY >= rect.bottom) {
                        collapsingElem = this.createCollapsingElement(dragInfo.dragZoneElem);
                        insertAfter(dragInfo.dragZoneElem, parentItem);
                    } else if (event.clientY <= rect.top) {
                        collapsingElem = this.createCollapsingElement(dragInfo.dragZoneElem);
                        insertBefore(dragInfo.dragZoneElem, parentItem);
                    }
                }
            } else if (!this.targetElem.dragZone) {
                if (this.props.tree && this.targetElem.matches(containerSelector)) {
                    if (this.targetElem.childElementCount === 0) {
                        collapsingElem = this.createCollapsingElement(dragInfo.dragZoneElem);
                        this.targetElem.append(dragInfo.dragZoneElem);
                    }
                } else {
                    collapsingElem = this.createCollapsingElement(dragInfo.dragZoneElem);
                    insertBefore(dragInfo.dragZoneElem, this.targetElem);
                }
            }
        } else if (
            this.props.tree
            && targetContainer
            && targetContainer.childElementCount === 0
            && !dragZoneContainsTarget
        ) {
            /* new target element has empty container */
            collapsingElem = this.createCollapsingElement(dragInfo.dragZoneElem);
            targetContainer.append(dragInfo.dragZoneElem);
        } else if (dragZoneBeforeTarget && !dragZoneContainsTarget) {
            /* drag zone element is before new drop target */
            animateElems = this.getMovingItems(dragInfo.dragZoneElem, this.targetElem);
            insertAfter(dragInfo.dragZoneElem, this.targetElem);
        } else if (dragZoneAfterTarget && !dragZoneContainsTarget) {
            /* drag zone element is after new drop target */
            animateElems = this.getMovingItems(dragInfo.dragZoneElem, this.targetElem);
            insertBefore(dragInfo.dragZoneElem, this.targetElem);
        }

        if (animateElems?.length > 0) {
            this.requestMoveAnimation(animateElems);
        }

        if (collapsingElem) {
            this.requestCollapsingAnimation(collapsingElem);
            this.requestExpandingAnimation(dragInfo.dragZoneElem);
        }

        avatar.saveSortTarget(this);
    }

    createCollapsingElement(elem) {
        if (!elem || !this.props.animated) {
            return null;
        }

        const res = elem.cloneNode(true);
        elem.before(res);
        return res;
    }

    requestExpandingAnimation(items) {
        const property = (this.props.vertical) ? 'height' : 'width';
        const sizeProp = (this.props.vertical) ? 'offsetHeight' : 'offsetWidth';

        const animated = asArray(items).map((elem) => ({
            elem,
            size: elem[sizeProp],
        }));

        animated.forEach((item) => {
            const { elem } = item;
            elem.style[property] = '0px';
            elem.style.margin = '0px';
        });

        requestAnimationFrame(() => {
            const animatedClass = this.getAnimatedClass();
            const transitionTimeout = this.getTransitionTimeout();

            animated.forEach((item) => {
                const { elem } = item;
                elem.classList.add(animatedClass);
                elem.style[property] = px(item.size);
                elem.style.margin = '';
                elem.style.transitionProperty = property;

                afterTransition(this.elem, {
                    property,
                    duration: transitionTimeout,
                    target: elem,
                }, () => {
                    elem.classList.remove(animatedClass);
                    elem.style[property] = '';
                    elem.style.transitionProperty = '';
                });
            });
        });
    }

    requestCollapsingAnimation(items) {
        const animated = asArray(items);
        const property = (this.props.vertical) ? 'height' : 'width';
        const sizeProp = (this.props.vertical) ? 'offsetHeight' : 'offsetWidth';

        animated.forEach((elem) => {
            const { style } = elem;
            style[property] = px(elem[sizeProp]);
        });

        requestAnimationFrame(() => {
            const animatedClass = this.getAnimatedClass();
            const transitionTimeout = this.getTransitionTimeout();

            animated.forEach((elem) => {
                const { style } = elem;
                elem.classList.add(animatedClass);
                style[property] = '0px';
                style.margin = '0px';
                style.transitionProperty = property;

                afterTransition(this.elem, {
                    property,
                    duration: transitionTimeout,
                    target: elem,
                }, () => {
                    elem.remove();
                });
            });
        });
    }

    getMovingItems(sourceEl, targetEl) {
        if (!sourceEl || !targetEl || !this.props.animated) {
            return [];
        }

        const nodeCmp = comparePosition(sourceEl, targetEl);
        const sourceAfterTarget = hasFlag(nodeCmp, 2);
        const sourceBeforeTarget = hasFlag(nodeCmp, 4);
        if (!sourceAfterTarget && !sourceBeforeTarget) {
            return [];
        }

        const res = [];
        const lastElem = (sourceBeforeTarget) ? targetEl : sourceEl;
        let elem = (sourceBeforeTarget) ? sourceEl : targetEl;

        while (elem) {
            res.push({
                elem,
                rect: elem.getBoundingClientRect(),
            });
            if (elem === lastElem) {
                break;
            }
            elem = elem.nextElementSibling;
        }

        return res;
    }

    requestMoveAnimation(items) {
        const animated = asArray(items);

        animated.forEach((item) => {
            const { elem } = item;
            const targetRect = elem.getBoundingClientRect();
            const distX = item.rect.left - targetRect.left;
            const distY = item.rect.top - targetRect.top;
            const trMatrix = [1, 0, 0, 1, distX, distY];
            transform(elem, `matrix(${trMatrix.join()})`);
            elem.style.transitionProperty = 'transform';
        });

        requestAnimationFrame(() => {
            const animatedClass = this.getAnimatedClass();
            const transitionTimeout = this.getTransitionTimeout();

            animated.forEach((item) => {
                const { elem } = item;
                elem.classList.add(animatedClass);
                transform(elem, '');

                afterTransition(this.elem, {
                    property: 'transform',
                    duration: transitionTimeout,
                    target: elem,
                }, () => {
                    elem.classList.remove(animatedClass);
                    transform(elem, '');
                    elem.style.transitionProperty = '';
                });
            });
        });
    }

    onDragEnd(avatar, e) {
        if (!this.targetElem || !(avatar instanceof SortableDragAvatar)) {
            avatar.onDragCancel(e);
            return;
        }

        this.hideHoverIndication();

        this.applySort(avatar, e);

        this.targetElem = null;
    }

    onDragCancel(avatar, e) {
        if (e?.type === 'keydown') {
            this.cancelSort(avatar, e);
        } else {
            this.applySort(avatar, e);
        }
    }

    applySort(avatar, e) {
        const avatarInfo = avatar.getDragInfo(e);
        avatar.onDragEnd();

        if (!avatarInfo.sortTarget) {
            return;
        }

        const { initialPos } = avatarInfo;
        const targetPos = avatar.getSortPosition();

        if (initialPos.prev === targetPos.prev && initialPos.next === targetPos.next) {
            return;
        }

        avatarInfo.dragZone.onSortEnd({
            e,
            elem: avatarInfo.dragZoneElem,
            initialPos,
            targetPos,
            targetElem: avatarInfo.sortTarget,
        });
    }

    cancelSort(avatar, e) {
        const avatarInfo = avatar.getDragInfo(e);
        avatar.onDragEnd();

        const { initialPos, dragZoneElem } = avatarInfo;
        if (initialPos.prev) {
            insertAfter(dragZoneElem, initialPos.prev);
        } else {
            insertBefore(dragZoneElem, initialPos.next);
        }
    }
}
