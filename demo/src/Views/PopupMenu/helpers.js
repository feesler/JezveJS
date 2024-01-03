import { createElement } from '@jezvejs/dom';
import { MenuButton } from 'jezvejs/MenuButton';

import { SelectIcon } from '../../assets/icons/SelectIcon.js';
import { SearchIcon } from '../../assets/icons/SearchIcon.js';

export const renderListItem = (id) => (
    createElement('div', {
        className: 'list-item',
        dataset: { id },
        children: [
            createElement('span', { textContent: `Item ${id}` }),
            MenuButton.create().elem,
        ],
    })
);

export const getDefaultItems = (logsField) => ([{
    id: 'selectBtnItem',
    icon: SelectIcon(),
    title: 'Button item',
    onClick: () => logsField.write('Button item clicked'),
}, {
    id: 'linkItem',
    type: 'link',
    title: 'Link item',
    icon: SearchIcon(),
    url: '#',
}, {
    id: 'noIconItem',
    title: 'No icon item',
}, {
    id: 'separator1',
    type: 'separator',
}, {
    id: 'separator2',
    type: 'separator',
    hidden: true,
}, {
    id: 'checkboxItem',
    type: 'checkbox',
    title: 'Checkbox item',
    onClick: (checked) => logsField.write(`Checkbox item toggled: ${checked}`),
}]);
