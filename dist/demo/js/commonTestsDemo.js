!function(n,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.jezvejs=t():n.jezvejs=t()}(self,(function(){return(self.webpackChunkjezvejs=self.webpackChunkjezvejs||[]).push([[372],{90484:function(n,t,e){"use strict";function o(n){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}e.d(t,{Z:function(){return o}})},28144:function(n,t,e){"use strict";e.r(t);var o=e(85772),r=e(19794),i=(e(22244),e(1161),e(4863),e(93379)),c=e.n(i),a=e(61728),u=(c()(a.Z,{insert:"head",singleton:!1}),a.Z.locals,null),s=null,l=null,d=null,f={};function p(n,t,e){var r=e||"";f.total+=1,t?f.ok+=1:f.fail+=1,s.textContent=f.total,l.textContent=f.ok,d.textContent=f.fail;var i=(0,o.ce)("tr",{},[(0,o.ce)("td",{textContent:n}),(0,o.ce)("td",{textContent:t?"OK":"FAIL"}),(0,o.ce)("td",{textContent:r})]);u.appendChild(i)}function h(n,t){var e=(0,o.ce)("tr",{className:"res-block-".concat(t)},(0,o.ce)("td",{colSpan:3,textContent:n}));u.appendChild(e)}function m(n,t){var e=!1,o="";try{console.log("Test: ".concat(n)),e=t()}catch(n){o=n.message}p(n,e,o)}function g(n,t){try{console.log("Test: ".concat(n)),t((function(){p(n,!0)}),(function(t){p(n,!1,t)}))}catch(t){p(n,!1,t.message)}}function v(n){var t=(0,o.ge)("evResult");t&&(t.textContent=n.toString())}function b(){var n,t,e,i,c,a;h("Utils",1),p("onReady()",!0),p("setTimeout()",!0),p("ge( string )",!0),n=[1,2,3,4],t=function(){},e=new Date,h("Type check",2),m("isFunction()",(function(){return(0,o.mf)(t)&&!(0,o.mf)(n)&&!(0,o.mf)(e)})),m("isDate()",(function(){return(0,o.J_)(e)&&!(0,o.J_)(n)&&!(0,o.J_)(t)})),function(){h("DOM",1);var n=(0,o.ge)("testview"),t=(0,o.ce)("div",null,null,{click:function(){v("click")},mouseover:function(){v("mouseover")},mouseout:function(){v("mouseout")}});n.appendChild(t),(0,o.$Z)(t,!1);var e=(0,o.ce)("div",{},[(0,o.ce)("div",{id:"child1"}),(0,o.ce)("div",{id:"child2"})]);t.appendChild(e),e=(0,o.ge)("child2"),m("contains",(function(){return t.contains(e)})),h("classList",2),m("classList.contains",(function(){return t.className="class1 class2 class3",t.classList.contains("class3")&&t.classList.contains("class1","class2","class3")})),m("classList.add",(function(){return t.classList.add("class4","class5"),t.classList.add("class6"),"class1 class2 class3 class4 class5 class6"===t.className})),m("classList.remove",(function(){return t.classList.remove("class1","class4"),t.classList.remove("class6"),"class2 class3 class5"===t.className})),m("isVisible",(function(){var n=(0,o.ce)("div");if(!(0,o.pn)("visibleElem"))throw new Error("Wrong visibility of visible element");if((0,o.pn)("hiddenElem1"))throw new Error("Wrong visibility of hidden element");if((0,o.pn)("hiddenElem2",!0))throw new Error("Wrong visibility of element inside of hierarchy of hidden");if((0,o.pn)(n,!0))throw new Error("Wrong visibility of element not attached to document");return!0}))}(),c='{"var1":"value1","var2":[1,2,3],"var3":{"subvar1":1}}',h("JSON",1),m("JSON.parse",(function(){return void 0!==(i=JSON.parse(c))&&"value1"===i.var1&&Array.isArray(i.var2)&&3===i.var2.length&&2===i.var2[1]&&void 0!==i.var3&&1===i.var3.subvar1})),m("JSON.stringify",(function(){return JSON.stringify(i)===c})),a="./ajax.php",h("AJAX",1),g("ajax.get",(function(n,t){r.h.get({url:"".concat(a,"?getcheck=1&ar[]=1&ar[]=2"),callback:function(e){var o=JSON.parse(e);void 0!==o&&"ok"===o.result&&"get"===o.method.toLowerCase()&&void 0!==o.get&&"1"===o.get.getcheck&&Array.isArray(o.get.ar)&&2===o.get.ar.length&&"1"===o.get.ar[0]&&"2"===o.get.ar[1]?n():t("Wrong AJAX response")}})})),g("ajax.post",(function(n,t){r.h.post({url:"".concat(a,"?getcheck=1"),data:"postcheck=1&ar[]=1&ar[]=2",callback:function(e){var o=JSON.parse(e);void 0!==o&&"ok"===o.result&&"post"===o.method.toLowerCase()&&void 0!==o.post&&void 0!==o.get&&"1"===o.get.getcheck&&Array.isArray(o.post.ar)&&2===o.post.ar.length&&"1"===o.post.ar[0]&&"2"===o.post.ar[1]?n():t("Wrong AJAX response")}})}))}function y(){f={total:0,ok:0,fail:0},p("Test initialization",!0),setTimeout(b)}(0,o.Um)((function(){var n=(0,o.ge)("startbtn");if(s=(0,o.ge)("totalRes"),l=(0,o.ge)("okRes"),d=(0,o.ge)("failRes"),u=(0,o.ge)("restbl"),!(n&&s&&l&&d&&u))throw new Error("Fail to init tests");n.onclick=y}))},19794:function(n,t,e){"use strict";e.d(t,{h:function(){return r}});var o=e(85772),r=new function(){function n(n){4===this.readyState&&n&&n(this.responseText)}function t(t){if(!t||!t.url||!t.method)return!1;var e=function(){try{return new XMLHttpRequest}catch(n){try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(n){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(n){return null}}}}();if(!e)return!1;var r=t.method.toLowerCase();if(!["get","head","post","put","delete","options"].includes(r))return!1;e.open(r,t.url,!0),t.headers&&Object.keys(t.headers).forEach((function(n){e.setRequestHeader(n,t.headers[n])})),"post"===r&&(function(n,t){if(!n)return null;var e=t.toLowerCase(),o=Object.keys(n).find((function(n){return e===n.toLowerCase()}));return o?n[o]:null}(t.headers,"Content-Type")||e.setRequestHeader("Content-Type","application/x-www-form-urlencoded")),(0,o.mf)(t.callback)&&(e.onreadystatechange=n.bind(e,t.callback));var i="data"in t?t.data:null;return e.send(i),!0}this.get=function(n){if(!n||!n.url)return!1;var e=(0,o.Zw)(n);return e.method="get",e.data=null,t(e)},this.post=function(n){if(!n||!n.url)return!1;var e=(0,o.Zw)(n);return e.method="post",t(e)}}},85772:function(n,t,e){"use strict";e.d(t,{ge:function(){return r},J_:function(){return i},mf:function(){return c},Kn:function(){return a},Zw:function(){return u},t4:function(){return s},KT:function(){return l},jl:function(){return d},Fl:function(){return f},Os:function(){return p},ce:function(){return h},YP:function(){return m},re:function(){return g},e9:function(){return v},GN:function(){return b},QV:function(){return y},pn:function(){return x},$Z:function(){return w},wp:function(){return E},wm:function(){return k},NW:function(){return S},Bc:function(){return T},x0:function(){return C},kP:function(){return j},DJ:function(){return L},Uc:function(){return _},Vt:function(){return A},BE:function(){return O},SH:function(){return N},yd:function(){return I},DV:function(){return R},Ro:function(){return M},GE:function(){return Z},q_:function(){return X},gD:function(){return P},os:function(){return U},p5:function(){return z},oe:function(){return J},xb:function(){return D},Tc:function(){return B},px:function(){return H},e5:function(){return F},YM:function(){return q},vs:function(){return W},L_:function(){return Y},Um:function(){return K},l7:function(){return V},CU:function(){return G}});var o=e(90484),r=document.getElementById.bind(document);function i(n){return n instanceof Date&&!isNaN(n.valueOf())}function c(n){return n&&("[object Function]"==={}.toString.call(n)||"function"==typeof n)}function a(n){return"object"===(0,o.Z)(n)&&"[object Object]"===Object.prototype.toString.call(n)}function u(n){var t;return Array.isArray(n)?n.map(u):a(n)?(t={},Object.keys(n).forEach((function(e){t[e]=u(n[e])})),t):n}function s(n,t){n&&t&&"object"===(0,o.Z)(t)&&Object.keys(t).forEach((function(e){var o=t[e];if(Array.isArray(o))n[e]=o.map((function(n){return n}));else if(a(o))null!==n[e]&&void 0!==n[e]||(n[e]={}),s(n[e],o);else try{n[e]=o}catch(t){n.setAttribute&&n.setAttribute(e,o)}}))}function l(n,t){n&&a(t)&&Object.keys(t).forEach((function(e){n.setAttribute(e,t[e])}))}function d(n,t){n&&t&&(Array.isArray(t)?t:[t]).forEach((function(t){t&&n.appendChild(t)}))}function f(n,t){n&&t&&Object.keys(t).forEach((function(e){n.addEventListener(e,t[e])}))}function p(n,t){n&&t&&Object.keys(t).forEach((function(e){n.removeEventListener(e,t[e])}))}function h(n,t,e,o){if("string"!=typeof n)return null;var r=document.createElement(n);return r?(t&&s(r,t),e&&d(r,e),o&&f(r,o),r):null}function m(n,t,e,o){if("string"!=typeof n)return null;var r=document.createElementNS("http://www.w3.org/2000/svg",n);return t&&l(r,t),e&&d(r,e),o&&f(r,o),r}function g(n){var t="string"==typeof n?r(n):n;return t&&t.parentNode?t.parentNode.removeChild(t):null}function v(n){return 0===parseFloat(n)||!!(n/n)}function b(n){var t=parseInt(n,10);return!isNaN(t)&&n===t&&n.toString()===t.toString()}function y(n){return n?window.getComputedStyle?getComputedStyle(n,""):n.currentStyle:null}function x(n,t){for(var e="string"==typeof n?r(n):n;e&&e.nodeType&&9!==e.nodeType;){var o=y(e);if(!o||"none"===o.display||"hidden"===o.visibility)return!1;if(!0!==t)break;e=e.parentNode}return!!e}function w(n,t){var e="string"==typeof n?r(n):n;e&&e.classList&&(t?e.classList.remove("hidden"):e.classList.add("hidden"))}function E(n,t){var e="string"==typeof n?r(n):n;e&&(e.disabled=!t)}function k(n){if(!n)return 0;if(n.focus(),n.selectionStart)return n.selectionStart;if(document.selection){var t=document.selection.createRange(),e=t.duplicate();return t.collapse(!0),e.moveToElementText(n),e.setEndPoint("EndToEnd",t),e.text.length}return 0}function S(n){if(!n)return null;if("selectionStart"in n&&document.activeElement===n)return{start:n.selectionStart,end:n.selectionEnd};if(n.createTextRange){var t=document.selection.createRange();if(t.parentElement()===n){var e,o,r=n.createTextRange();for(r.moveToBookmark(t.getBookmark()),e=0;r.compareEndPoints("EndToStart",r)>0;r.moveEnd("character",-1))e+=1;for(r.setEndPoint("StartToStart",n.createTextRange()),o={start:0,end:e};r.compareEndPoints("EndToStart",r)>0;r.moveEnd("character",-1))o.start+=1,o.end+=1;return o}}return null}function T(n,t){if(n)if(n.createTextRange){var e=n.createTextRange();e.collapse(!0),e.moveEnd("character",t),e.moveStart("character",t),e.select()}else n.setSelectionRange&&n.setSelectionRange(t,t)}function C(n){if("string"!=typeof n||!n.length)return!1;var t=n.split(".");return 3===t.length&&!!(v(t[0])&&v(t[1])&&v(t[2]))&&!(t[0]<1||t[0]>31||t[1]<1||t[1]>12||t[2]<1970)}function j(n){if(!n||!n.options||-1===n.selectedIndex)return-1;var t=n.options[n.selectedIndex];return t.textContent?t.textContent:t.innerText}function L(n){return n&&n.options&&-1!==n.selectedIndex?n.options[n.selectedIndex].value:-1}function _(n,t,e){if(!n||!n.options||void 0===t)return!1;for(var o=t.toString(),r=0,i=n.options.length;r<i;r+=1){var c=n.options[r];if(c&&c.value===o)return n.multiple?c.selected=void 0===e||e:n.selectedIndex=r,!0}return!1}function A(n,t){return t&&t.parentNode?t.parentNode.insertBefore(n,t):null}function O(n,t){var e=t.parentNode,o=t.nextSibling;return o?e.insertBefore(n,o):e.appendChild(n)}function N(n,t){if(t&&n){var e=Array.isArray(t)?t:[t],o=n.firstChild;o?e.reduce((function(n,t){return A(t,n),t}),o):e.forEach((function(t){return n.appendChild(t)}))}}function I(n){if(n)for(;n.childNodes.length>0;)n.removeChild(n.childNodes[0])}function R(n,t){if((n=n||window.event).currentTarget||(n.currentTarget=t),n.target||(n.target=n.srcElement),n.relatedTarget||("mouseover"===n.type&&(n.relatedTarget=n.fromElement),"mouseout"===n.type&&(n.relatedTarget=n.toElement)),null===n.pageX&&null!==n.clientX){var e=document.documentElement,o=document.body;n.pageX=n.clientX+(e.scrollLeft||o&&o.scrollLeft||0),n.pageX-=e.clientLeft||0,n.pageY=n.clientY+(e.scrollTop||o&&o.scrollTop||0),n.pageY-=e.clientTop||0}return!n.which&&n.button&&(1&n.button?n.which=1:2&n.button?n.which=3:n.which=4&n.button?2:0),n}function M(n,t,e){var o=!0,i=Array.isArray(e)?e:[e];c(t)&&(n&&(o=i.every((function(t){var e=("string"==typeof t?r(t):t)||null;return e&&!e.contains(n.target)&&e!==n.target||!e}))),o&&t())}function Z(n,t){var e=null,o=n||null;document.documentElement&&(c(o)&&(e=function(n){M(n,o,t)}),document.documentElement.onclick=null,setTimeout((function(){document.documentElement.onclick=e})))}function X(n){for(var t=n,e=0,o=0;t;)e+=parseInt(t.offsetTop,10),o+=parseInt(t.offsetLeft,10),t=t.offsetParent;return{top:e,left:o}}function P(n){var t=n.getBoundingClientRect(),e=document.body,o=document.documentElement,r=window.pageYOffset||o.scrollTop||e.scrollTop,i=window.pageXOffset||o.scrollLeft||e.scrollLeft,c=o.clientTop||e.clientTop||0,a=o.clientLeft||e.clientLeft||0,u=t.top+r-c,s=t.left+i-a;return{top:Math.round(u),left:Math.round(s)}}function U(n){return n.getBoundingClientRect?P(n):X(n)}function z(n,t){return n.compareDocumentPosition?n.compareDocumentPosition(t):(n!==t&&n.contains(t)&&16)+(n!==t&&t.contains(n)&&8)+(n.sourceIndex>=0&&t.sourceIndex>=0?(n.sourceIndex<t.sourceIndex&&4)+(n.sourceIndex>t.sourceIndex&&2):1)}function J(){if(void 0!==window.pageXOffset)return{left:pageXOffset,top:pageYOffset};var n=document.documentElement,t=document.body,e=n.scrollTop||t&&t.scrollTop||0;e-=n.clientTop;var o=n.scrollLeft||t&&t.scrollLeft||0;return{top:e,left:o-=n.clientLeft}}function D(n){return"object"!==(0,o.Z)(n)||0===Object.keys(n).length}function B(n){return"object"===(0,o.Z)(n)?Object.keys(n).length:0}function H(n){return"".concat(parseInt(n,10),"px")}function F(n){var t=[];return a(n)?(Object.keys(n).forEach((function(e){var o=n[e];if(Array.isArray(o))o.forEach((function(n){if(!a(n)){var o=encodeURIComponent(e),r=encodeURIComponent(n.toString());t.push("".concat(o,"[]=").concat(r))}}));else if(!a(o)){var r=encodeURIComponent(e),i=encodeURIComponent(o.toString());t.push("".concat(r,"=").concat(i))}})),t.join("&")):""}function q(){if(document){if(document.head)return document.head;if(document.documentElement&&document.documentElement.firstChild)return document.documentElement.firstChild}return null}function W(n,t){n&&n.style&&(void 0!==n.style.webkitTransform?n.style.webkitTransform=t:void 0!==n.style.MozTransform?n.style.MozTransform=t:void 0!==n.style.msTransform?n.style.msTransform=t:void 0!==n.style.transform&&(n.style.transform=t))}function Y(){return window.devicePixelRatio?window.devicePixelRatio:screen.deviceXDPI&&screen.logicalXDPI?screen.deviceXDPI/screen.logicalXDPI:screen.availWidth/document.documentElement.clientWidth}function K(n){K.readyList.length||function(n){var t=!1;function e(){t||(t=!0,function(){for(var n=0;n<K.readyList.length;n+=1)K.readyList[n]()}())}document.addEventListener?document.addEventListener("DOMContentLoaded",(function(){e()}),!1):document.attachEvent&&(document.documentElement.doScroll&&window===window.top&&function n(){if(!t&&document.body)try{document.documentElement.doScroll("left"),e()}catch(t){setTimeout(n,0)}}(),document.attachEvent("onreadystatechange",(function(){"complete"===document.readyState&&e()}))),window.addEventListener?window.addEventListener("load",e,!1):window.attachEvent&&window.attachEvent("onload",e)}(),K.readyList.push(n)}function V(n,t){function e(){}e.prototype=t.prototype,n.prototype=new e,n.prototype.constructor=n,n.parent=t.prototype}function G(n){n.prototype=Object.create(Error.prototype,{constructor:{value:Error,enumerable:!1,writable:!0,configurable:!0}}),Object.setPrototypeOf?Object.setPrototypeOf(n,Error):n.__proto__=Error}K.readyList=[]},24668:function(n,t,e){"use strict";var o=e(23645),r=e.n(o)()((function(n){return n[1]}));r.push([n.id,'* {\n  margin: 0;\n  padding: 0;\n  border: 0 none;\n}\n\n*,\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,\n    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",\n    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n\n/* Hide clear button inside inputs */\n::-ms-clear {\n  display: none;\n}\n\n/* WebKit focus fix */\n*:focus {\n  outline: none;\n}\n\ninput[type="button"],\ninput[type="submit"],\nbutton {\n  overflow: visible;    /* IE button padding fix */\n  -webkit-appearance: button;\n          appearance: button;   /* iOS Safari styling issue fix */\n}\n\n/* Firefox fix */\nbutton::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\n/* Hidden element */\n.hidden {\n  display: none !important;\n}\n\n/* Clearfix */\n.clearfix {\n  float: none;\n  clear: both;\n  display: table;\n  zoom: 1;\n}\n\n.clearfix::after {\n  content: ". .";\n  display: block;\n  word-spacing: 99in;\n  height: 0;\n  overflow: hidden;\n  font-size: 0.13em;      /* Opera fix */\n  line-height: 0;\n}\n',""]),t.Z=r},28690:function(n,t,e){"use strict";var o=e(23645),r=e.n(o)()((function(n){return n[1]}));r.push([n.id,'/* Main layout */\nhtml,\nbody {\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial,\n    "Noto Sans",\n    sans-serif,\n    "Apple Color Emoji",\n    "Segoe UI Emoji",\n    "Segoe UI Symbol",\n    "Noto Color Emoji";\n  height: 100%;\n  border: 0 none;\n  margin: 0;\n  padding: 0;\n}\n\n/* Main layout */\n.page {\n  display: table;\n  border-collapse: collapse;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n}\n\n.page-wrapper {\n  display: table-cell;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n  position: static;\n}\n\n/* Main content */\n.page-container {\n  display: table;\n  table-layout: fixed;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n}\n\n.page-content {\n  display: table-cell;\n  min-height: 100%;\n  height: 100%;\n}\n\n.page-content-wrap {\n  padding: 12px;\n}\n\n/* Typography */\nh1,\nh2,\nh3 {\n  font-family: "Segoe UI", Arial, sans-serif;\n  font-weight: normal;\n  padding: 10px 0 5px 0;\n}\n\nh1 {\n  font-size: 22px;\n}\n\nh2 {\n  font-size: 20px;\n}\n\nh3 {\n  font-size: 18px;\n}\n\n.btn,\n.btn:visited {\n  font-weight: normal;\n  font-size: 16px;\n  display: inline-block;\n  color: #ffffff;\n  background-color: #0072c6;\n  text-decoration: none;\n  border: 0 none;\n  padding: 4px 22px;\n  margin-right: 15px;\n  vertical-align: middle;\n  overflow: visible;\n  border-radius: 0;\n}\n\n.inp {\n  border: 1px solid #000000;\n  padding: 4px 8px;\n}\n\n/* Navigation */\n.nav-header {\n  background-color: #404040;\n  color: #ffffff;\n  padding: 12px;\n}\n\n.nav-header__logo {\n  padding: 6px 0;\n}\n\n.nav-header__logo > a {\n  text-decoration: none;\n  color: #dddddd;\n}\n\n.nav-header__logo > a:hover {\n  color: #ffffff;\n}\n\n.nav-header__menu-item {\n  display: inline;\n  padding: 0 10px 0 0;\n  font-size: 14px;\n}\n\n.nav-header__menu-item-active {\n  font-weight: bold;\n}\n\n/* Admin action button */\n.adm_act_btn {\n  padding: 3px 10px;\n  background-color: #44aaff;\n  color: #ffffff;\n}\n\n.adm_act_btn:disabled {\n  background-color: #708290;\n}\n',""]),t.Z=r},29014:function(n,t,e){"use strict";var o=e(23645),r=e.n(o)()((function(n){return n[1]}));r.push([n.id,'.page {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 12px;\n}\n\n.page_wrapper {\n  display: table;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n  position: relative;\n  border-collapse: collapse;\n}\n\n/* Main content */\n.container {\n  display: table-cell;\n  min-height: 100%;\n}\n\n.content {\n  min-height: 100%;\n  height: 100%;\n}\n\nh2 {\n  font-family: "Segoe UI", Arial, sans-serif;\n  font-size: 20px;\n  font-weight: normal;\n  padding: 10px 0 5px 0;\n}\n\n.tests_content {\n  height: 100%;\n}\n\n.results,\n.testview,\n.ph {\n  display: inline-block;\n  float: left;\n  height: 100%;\n}\n\n.controls {\n  padding: 0 0 10px 0;\n}\n\n.btn {\n  padding: 3px 10px;\n  background-color: #44aaff;\n  color: #ffffff;\n}\n\n.tbl_container {\n  max-height: 700px;\n  overflow-y: auto;\n}\n\n.tbl_container table {\n  border-collapse: collapse;\n}\n\n.tbl_container td {\n  border: 1px solid #000000;\n  padding: 5px;\n}\n\n/* Admin table */\n.adm_tbl {\n  border-collapse: collapse;\n  border: 1px solid #000000;\n}\n\n.adm_tbl th,\n.adm_tbl td {\n  border: 1px solid #000000;\n  padding: 5px;\n}\n\n.adm_tbl tr {\n  cursor: pointer;\n}\n\n.adm_tbl tr:hover td {\n  background-color: #bbbbbb;\n}\n\n.adm_tbl.counter_tbl {\n  display: inline;\n  border: 0 none;\n}\n\n.counter_tbl td.title {\n  border-right: 0 none;\n}\n\n.counter_tbl td.title + td {\n  border-left: 0 none;\n}\n\n.results {\n  width: 40%;\n}\n\n.res-block-1 {\n  background-color: #005588;\n  color: #ffffff;\n}\n\n.res-block-2 {\n  background-color: #0099bb;\n}\n\n.res-block-3 {\n  background-color: #22ccff;\n}\n\n/* Test view */\n.testview {\n  width: 50%;\n  max-height: 730px;\n  overflow: hidden;\n}\n',""]),t.Z=r},61728:function(n,t,e){"use strict";var o=e(23645),r=e.n(o)()((function(n){return n[1]}));r.push([n.id,".container {\n  padding: 5px;\n}\n\n.container__dashed {\n  border: 2px dashed;\n}\n\n/* Test div */\n.class5 {\n  width: 50px;\n  height: 50px;\n  background-color: #6f32ff;\n}\n\n.square {\n  width: 100px;\n  height: 100px;\n  border: 0 none;\n}\n\n.square.square__red {\n  background-color: #dd0055;\n}\n\n.square.square__green {\n  background-color: #00dd55;\n}\n\n#restbl th,\n#restbl td {\n  border: 1px solid #000000;\n}\n",""]),t.Z=r},23645:function(n){"use strict";n.exports=function(n){var t=[];return t.toString=function(){return this.map((function(t){var e=n(t);return t[2]?"@media ".concat(t[2]," {").concat(e,"}"):e})).join("")},t.i=function(n,e,o){"string"==typeof n&&(n=[[null,n,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var c=this[i][0];null!=c&&(r[c]=!0)}for(var a=0;a<n.length;a++){var u=[].concat(n[a]);o&&r[u[0]]||(e&&(u[2]?u[2]="".concat(e," and ").concat(u[2]):u[2]=e),t.push(u))}},t}},22244:function(n,t,e){"use strict";var o=e(93379),r=e.n(o),i=e(24668);r()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},4863:function(n,t,e){"use strict";var o=e(93379),r=e.n(o),i=e(28690);r()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},1161:function(n,t,e){"use strict";var o=e(93379),r=e.n(o),i=e(29014);r()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},93379:function(n,t,e){"use strict";var o,r=function(){var n={};return function(t){if(void 0===n[t]){var e=document.querySelector(t);if(window.HTMLIFrameElement&&e instanceof window.HTMLIFrameElement)try{e=e.contentDocument.head}catch(n){e=null}n[t]=e}return n[t]}}(),i=[];function c(n){for(var t=-1,e=0;e<i.length;e++)if(i[e].identifier===n){t=e;break}return t}function a(n,t){for(var e={},o=[],r=0;r<n.length;r++){var a=n[r],u=t.base?a[0]+t.base:a[0],s=e[u]||0,l="".concat(u," ").concat(s);e[u]=s+1;var d=c(l),f={css:a[1],media:a[2],sourceMap:a[3]};-1!==d?(i[d].references++,i[d].updater(f)):i.push({identifier:l,updater:m(f,t),references:1}),o.push(l)}return o}function u(n){var t=document.createElement("style"),o=n.attributes||{};if(void 0===o.nonce){var i=e.nc;i&&(o.nonce=i)}if(Object.keys(o).forEach((function(n){t.setAttribute(n,o[n])})),"function"==typeof n.insert)n.insert(t);else{var c=r(n.insert||"head");if(!c)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");c.appendChild(t)}return t}var s,l=(s=[],function(n,t){return s[n]=t,s.filter(Boolean).join("\n")});function d(n,t,e,o){var r=e?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(n.styleSheet)n.styleSheet.cssText=l(t,r);else{var i=document.createTextNode(r),c=n.childNodes;c[t]&&n.removeChild(c[t]),c.length?n.insertBefore(i,c[t]):n.appendChild(i)}}function f(n,t,e){var o=e.css,r=e.media,i=e.sourceMap;if(r?n.setAttribute("media",r):n.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),n.styleSheet)n.styleSheet.cssText=o;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(o))}}var p=null,h=0;function m(n,t){var e,o,r;if(t.singleton){var i=h++;e=p||(p=u(t)),o=d.bind(null,e,i,!1),r=d.bind(null,e,i,!0)}else e=u(t),o=f.bind(null,e,t),r=function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(e)};return o(n),function(t){if(t){if(t.css===n.css&&t.media===n.media&&t.sourceMap===n.sourceMap)return;o(n=t)}else r()}}n.exports=function(n,t){(t=t||{}).singleton||"boolean"==typeof t.singleton||(t.singleton=(void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o));var e=a(n=n||[],t);return function(n){if(n=n||[],"[object Array]"===Object.prototype.toString.call(n)){for(var o=0;o<e.length;o++){var r=c(e[o]);i[r].references--}for(var u=a(n,t),s=0;s<e.length;s++){var l=c(e[s]);0===i[l].references&&(i[l].updater(),i.splice(l,1))}e=u}}}}},function(n){"use strict";return 28144,n(n.s=28144)}])}));