import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

export class InputGroup extends Component {
    static create(props = {}) {
        const instance = new InputGroup(props);
        return instance;
    }
}
