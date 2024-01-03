import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';
import { CloseButton } from 'jezvejs/CloseButton';
import './BlueBox.scss';

export class BlueBox extends Component {
    static userProps = {
        elem: ['id'],
    };

    constructor(props) {
        super(props);

        const title = createElement('span', {
            className: 'box__title',
            textContent: 'click',
        });
        this.elem = createElement('div', {
            className: 'bluebox',
            children: [
                title,
                CloseButton.create({
                    tabIndex: -1,
                }).elem,
            ],
        });

        this.setUserProps();
    }
}
