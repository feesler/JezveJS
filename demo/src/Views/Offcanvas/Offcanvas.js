import 'jezvejs/style';
import 'jezvejs/style/Button';
import { ge, onReady } from 'jezvejs';
import { Offcanvas } from 'jezvejs/Offcanvas';
import { initNavigation } from '../../app.js';
import './style.scss';

const logTo = (target, value) => {
    const elem = (typeof target === 'string') ? ge(target) : target;
    if (!elem) {
        return;
    }

    elem.value += `${value}\r\n`;
};

const initDefault = () => {
    const offcanvas = Offcanvas.create({
        content: ge('defaultContent'),
        onOpened: () => logTo('result', 'Opened'),
        onClosed: () => logTo('result', 'Closed'),
    });

    const btn = ge('showDefaultBtn');
    btn.addEventListener('click', () => offcanvas.open());
    const toggleBtn = ge('toggleTopBtn');
    toggleBtn.addEventListener('click', () => offcanvas.toggle());
};

const initRight = () => {
    const offcanvas = Offcanvas.create({
        content: ge('rightContent'),
        placement: 'right',
    });

    const btn = ge('showRightBtn');
    btn.addEventListener('click', () => offcanvas.open());
};

const initTop = () => {
    const offcanvas = Offcanvas.create({
        content: ge('topContent'),
        placement: 'top',
    });

    const btn = ge('showTopBtn');
    btn.addEventListener('click', () => offcanvas.open());
};

const initBottom = () => {
    const offcanvas = Offcanvas.create({
        content: ge('bottomContent'),
        placement: 'bottom',
    });

    const btn = ge('showBottomBtn');
    btn.addEventListener('click', () => offcanvas.open());
};

const initResponsive = () => {
    const offcanvas = Offcanvas.create({
        content: ge('responsiveContent'),
        className: 'offcanvas-responsive',
    });

    const btn = ge('showResponsiveBtn');
    btn.addEventListener('click', () => offcanvas.open());
};

const init = () => {
    initNavigation();

    initDefault();
    initRight();
    initTop();
    initBottom();
    initResponsive();
};

onReady(init);
