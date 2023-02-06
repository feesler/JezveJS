import { getClassNames } from '../../js/common.js';
import { Popup } from '../Popup/Popup.js';
import './style.scss';

const NOTIFICATION_CLASS = 'notification';
const DEFAULT_CLASS = 'default';
const SUCCESS_CLASS = 'success';
const ERROR_CLASS = 'error';

/** Available notification types */
const classMap = {
    default: DEFAULT_CLASS,
    success: SUCCESS_CLASS,
    error: ERROR_CLASS,
};

const defaultProps = {
    type: 'default',
    closeOnEmptyClick: true,
    closeButton: true,
};

export class Notification extends Popup {
    constructor(props = {}) {
        const popupProps = {
            ...defaultProps,
            ...props,
            nodim: true,
        };

        if (typeof popupProps.type !== 'string' || !(popupProps.type in classMap)) {
            throw new Error('Invalid notification type');
        }

        popupProps.className = getClassNames(
            NOTIFICATION_CLASS,
            classMap[popupProps.type],
            props.className,
        );

        super(popupProps);
    }
}
