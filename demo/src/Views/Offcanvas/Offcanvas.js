import 'jezvejs/style';
import 'jezvejs/style/Button';
import { ge, onReady, setEvents } from 'jezvejs';
import { Offcanvas } from 'jezvejs/Offcanvas';
import { initNavigation } from '../../app.js';
import './OffcanvasView.scss';

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

    setEvents(ge('showDefaultBtn'), { click: () => offcanvas.open() });
    setEvents(ge('toggleTopBtn'), { click: () => offcanvas.toggle() });
};

const initRight = () => {
    const offcanvas = Offcanvas.create({
        content: ge('rightContent'),
        placement: 'right',
    });

    setEvents(ge('showRightBtn'), { click: () => offcanvas.open() });
};

const initTop = () => {
    const offcanvas = Offcanvas.create({
        content: ge('topContent'),
        placement: 'top',
    });

    setEvents(ge('showTopBtn'), { click: () => offcanvas.open() });
};

const initBottom = () => {
    const offcanvas = Offcanvas.create({
        content: ge('bottomContent'),
        placement: 'bottom',
    });

    setEvents(ge('showBottomBtn'), { click: () => offcanvas.open() });
};

const initResponsive = () => {
    const offcanvas = Offcanvas.create({
        content: ge('responsiveContent'),
        className: 'offcanvas-responsive',
    });

    setEvents(ge('showResponsiveBtn'), { click: () => offcanvas.open() });
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
