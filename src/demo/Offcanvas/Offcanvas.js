import { ge, onReady } from '../../js/index.js';
import '../../css/common.scss';
import '../css/app.scss';
import './style.scss';
import { Offcanvas } from '../../Components/Offcanvas/Offcanvas.js';

const initDefault = () => {
    const offcanvas = Offcanvas.create({
        content: ge('defaultContent'),
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
    initDefault();
    initRight();
    initTop();
    initBottom();
    initResponsive();
};

onReady(init);
