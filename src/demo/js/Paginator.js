import {
    ge,
    onReady,
} from '../../js/common.js';
import { Paginator } from '../../Components/Paginator/Paginator.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import '../css/collapsible.css';

function initSimple() {
    const paginator = new Paginator({
        pagesCount: 10
    });

    ge('simple').appendChild(paginator.elem);
}

onReady(() => {
    initSimple();
});
