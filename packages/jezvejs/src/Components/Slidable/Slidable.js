import { isFunction } from '@jezvejs/types';
import { ge, setEvents } from '../../js/common.js';
import { SliderDragZone } from './components/SliderDragZone.js';
import { SliderDropTarget } from './components/SliderDropTarget.js';

const defaultProps = {
    vertical: false,
    allowMouse: false,
    allowTouch: true,
    isReady: true,
    updatePosition: null,
    onDragEnd: null,
    onWheel: null,
};

export class Slidable {
    static create(...args) {
        return new this(...args);
    }

    constructor(props = {}) {
        this.props = {
            ...defaultProps,
            ...props,
        };

        this.wheelHandler = { wheel: (e) => this.onWheel(e) };

        this.init();
    }

    init() {
        const {
            elem,
            content,
            vertical,
            allowMouse,
            allowTouch,
            isReady,
        } = this.props;

        this.elem = (typeof elem === 'string') ? ge(elem) : elem;
        if (!this.elem) {
            throw new Error('Invalid element');
        }
        this.content = (typeof content === 'string') ? ge(content) : content;
        if (!this.content) {
            throw new Error('Invalid content element');
        }

        this.dragZone = SliderDragZone.create({
            elem: this.content,
            vertical,
            allowMouse,
            allowTouch,
            isReady,
            updatePosition: (...args) => this.onUpdatePosition(...args),
        });
        this.dropTarget = SliderDropTarget.create({
            elem: this.elem,
            onDragEnd: (...args) => this.onDragEnd(...args),
        });

        if (isFunction(this.props.onWheel)) {
            setEvents(this.elem, this.wheelHandler);
        }
    }

    /**
     * Mouse whell event handler
     * @param {Event} e - wheel event object
     */
    onWheel(e) {
        e.preventDefault();

        if (e.deltaY === 0) {
            return;
        }

        this.props.onWheel(e);
    }

    onUpdatePosition(...args) {
        if (isFunction(this.props.updatePosition)) {
            this.props.updatePosition(...args);
        }
    }

    onDragEnd(...args) {
        if (isFunction(this.props.onDragEnd)) {
            this.props.onDragEnd(...args);
        }
    }
}
