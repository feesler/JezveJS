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
            props: {
                className: 'box__title',
                textContent: 'click',
            },
        });
        this.elem = createElement('div', {
            props: { className: 'bluebox' },
            children: [title, CloseButton.create().elem],
        });

        this.setUserProps();
    }
}
