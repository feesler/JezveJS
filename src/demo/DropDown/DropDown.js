import {
    isObject,
    ge,
    ce,
    onReady,
} from '../../js/common.js';
import { DropDown } from '../../Components/DropDown/DropDown.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import './dropdown.css';

function initItems(title, count) {
    const res = [];

    for (let ind = 1; ind < count; ind += 1) {
        res.push({ id: ind, title: `${title} ${ind}` });
    }

    return res;
}

/** Test enable\disable feature */
function toggleEnable(e) {
    const btn = e.target;

    this.enable(!!this.disabled);
    btn.value = (this.disabled) ? 'Enable' : 'Disable';
}

function customRenderItem(item) {
    const deselectButton = ce('span', { className: 'dd__del-selection-item-btn' });
    deselectButton.addEventListener('click', this.delSelectItemHandler);

    return ce(
        'span',
        { className: 'dd__selection-item dd__custom-selection-item' },
        [
            deselectButton,
            ce('span', { innerText: item.title.toLowerCase() }),
        ],
    );
}

/** Test enable\disable feature */
function toggleEnable2(e) {
    const btn = e.target;

    this.enable(!!this.disabled);
    btn.value = (this.disabled) ? 'Enable' : 'Disable';
}

function formatObject(value) {
    let entries;

    if (Array.isArray(value)) {
        entries = value.map((entry) => formatObject(entry));

        return `[${entries.join(', ')}]`;
    }

    if (isObject(value)) {
        entries = Object.keys(value).map((key) => `${key}: ${value[key]}`);

        return `{ ${entries.join(', ')} }`;
    }

    return value.toString();
}

function logTo(target, value) {
    const elem = (typeof target === 'string') ? ge(target) : target;
    if (!elem) {
        return;
    }

    elem.value += `${value}\r\n`;
}

function init() {
    // Standard inline drop down
    DropDown.create({
        input_id: 'selinp',
        editable: false,
        placeholder: 'Select item',
        data: initItems('Item', 10),
    });

    DropDown.create({
        input_id: 'selinp2',
        maxHeight: 6,
        editable: true,
        placeholder: 'Select item 2',
        data: initItems('Long item test Lorem ipsum dolor sit amet', 10),
    });

    // Stretch drop down 100% width
    DropDown.create({
        input_id: 'selinp3',
        extraClass: 'dd_stretch',
        editable: true,
        placeholder: 'Select item 3',
        data: initItems('Item', 10),
    });

    // Stretch drop down 50% width
    DropDown.create({
        input_id: 'selinp4',
        extraClass: 'dd_stretch',
        editable: true,
        placeholder: 'Select item 4',
        data: initItems('Item', 10),
        onitemselect(selection) {
            logTo('log-single', `itemselect: ${formatObject(selection)}`);
        },
        onchange(selection) {
            logTo('log-single', `change: ${formatObject(selection)}`);
        },
    });

    // Parse select element (with no default selection)
    DropDown.create({
        input_id: 'sel0',
        editable: true,
        placeholder: 'Select item 5',
    });

    // Parse select element (with selected option support)
    DropDown.create({
        input_id: 'sel',
        editable: true,
        placeholder: 'Select item 5',
    });

    // Disabled options support
    DropDown.create({
        input_id: 'disabledopt',
        editable: false,
    });

    // Option groups support
    DropDown.create({
        input_id: 'optgroupssel',
        editable: false,
    });

    // Dynamic groups create
    const groupsDropDown = DropDown.create({
        input_id: 'optgroupsdyn',
        editable: false,
        data: initItems('Visible item', 3),
    });
    const customGroup = groupsDropDown.addGroup('Hidden');
    const hiddenGroupItems = initItems('Hidden item', 3);
    hiddenGroupItems.forEach(
        (item) => groupsDropDown.addItem({ ...item, group: customGroup }),
    );

    // Attach drop down to block element
    DropDown.create({
        input_id: 'box',
        listAttach: true,
        editable: false,
        data: initItems('Long Item Lorem Lorem', 10),
    });

    // Attach drop down to inline element
    DropDown.create({
        input_id: 'inline',
        extraClass: 'link_inline_cont',
        listAttach: true,
        data: initItems('Long Item Lorem Lorem ', 10),
    });

    // Clipping test
    DropDown.create({ input_id: 'clipped' });

    // Multiple select drop down
    DropDown.create({
        input_id: 'selinp5',
        extraClass: 'dd_stretch',
        placeholder: 'Multi select control',
        onitemselect(selection) {
            logTo('log-multi', `itemselect: ${formatObject(selection)}`);
        },
        onchange(selection) {
            logTo('log-multi', `change: ${formatObject(selection)}`);
        },
    });

    // Generated multiple select drop down
    const genDropDown = DropDown.create({
        input_id: 'selinp6',
        extraClass: 'dd_stretch',
        placeholder: 'Multi select control',
        onitemselect(selection) {
            logTo('log-genmulti', `itemselect: ${formatObject(selection)}`);
        },
        editable: false,
        multi: true,
        onchange(selection) {
            logTo('log-genmulti', `change: ${formatObject(selection)}`);
        },
    });
    const genData = initItems('Multi select', 10);
    genData.forEach((item) => {
        const props = { ...item };

        if (item.id === 3) {
            props.disabled = true;
        }

        genDropDown.addItem(props);
    });

    const enableOptionBtn = ge('enableOptionBtn');
    enableOptionBtn.addEventListener('click', () => {
        const item = genDropDown.getItem(3);
        genDropDown.enableItem(3, item.disabled);
    });

    // Disabled single select drop down
    const disabledSingleDropDown = DropDown.create({
        input_id: 'selinp7single',
        extraClass: 'dd_stretch',
        disabled: true,
        placeholder: 'Multi select control',
    });

    const enableSingleBtn = ge('enableSingleBtn');
    if (enableSingleBtn) {
        enableSingleBtn.addEventListener('click', toggleEnable.bind(disabledSingleDropDown));
    }

    // Disabled multiple select drop down
    const disabledDropDown = DropDown.create({
        input_id: 'selinp7',
        extraClass: 'dd_stretch',
        disabled: true,
        placeholder: 'Multi select control',
    });

    const enableBtn = ge('enableBtn');
    if (enableBtn) {
        enableBtn.addEventListener('click', toggleEnable.bind(disabledDropDown));
    }

    // Built-in items filter
    DropDown.create({
        input_id: 'selinp8',
        oninput: true,
        placeholder: 'Type to filter',
        data: initItems('Filter item', 100),
    });

    // Custom render drop down
    const customDropDown = DropDown.create({
        input_id: 'selinp10',
        extraClass: 'dd_stretch',
        placeholder: 'Multi select control',
        onitemselect(selection) {
            logTo('log-custom', `itemselect: ${formatObject(selection)}`);
        },
        onchange(selection) {
            logTo('log-custom', `change: ${formatObject(selection)}`);
        },
        renderItem: customRenderItem,
    });

    const enableBtn2 = ge('enableBtn2');
    if (enableBtn2) {
        enableBtn2.onclick = toggleEnable2.bind(customDropDown);
    }

    DropDown.create({
        input_id: 'selinp11',
        placeholder: 'Use native select',
        useNativeSelect: true,
        editable: false,
    });

    DropDown.create({
        input_id: 'selinp12',
        placeholder: 'Full screen',
        fullScreen: true,
        editable: true,
    });

    // Dynamic add/remove items
    const dynamicDropDown = DropDown.create({
        input_id: 'dynamicSel',
        placeholder: 'Dynamic Drop Down',
        editable: false,
        multi: true,
    });

    const addBtn = ge('addBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const itemId = dynamicDropDown.items.length + 1;
            dynamicDropDown.addItem({
                id: itemId,
                title: `Item ${itemId}`,
            });
        });
    }

    const addDisabledBtn = ge('addDisBtn');
    if (addDisabledBtn) {
        addDisabledBtn.addEventListener('click', () => {
            const itemId = dynamicDropDown.items.length + 1;
            dynamicDropDown.addItem({
                id: itemId,
                title: `Item ${itemId}`,
                disabled: true,
            });
        });
    }

    const delBtn = ge('delBtn');
    if (delBtn) {
        delBtn.addEventListener('click', () => {
            const itemsCount = dynamicDropDown.items.length;
            if (!itemsCount) {
                return;
            }

            const item = dynamicDropDown.items[itemsCount - 1];
            dynamicDropDown.removeItem(item.id);
        });
    }

    const delAllBtn = ge('delAllBtn');
    if (delAllBtn) {
        delAllBtn.addEventListener('click', () => {
            dynamicDropDown.removeAll();
        });
    }
}

onReady(init);
