import 'jezvejs/style';
import { onReady } from 'jezvejs';
import { renderVersion, renderNavigationMenu } from '../../app.js';
import '../../app.scss';
import './style.scss';

const init = () => {
    const navMenu = renderNavigationMenu();
    const menuContainer = document.querySelector('.menu-container');
    menuContainer.append(navMenu);

    renderVersion();
};

onReady(init);
