!function(n,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("jezvejs",[],e):"object"==typeof exports?exports.jezvejs=e():n.jezvejs=e()}(self,(function(){return(self.webpackChunkjezvejs=self.webpackChunkjezvejs||[]).push([[723],{90484:function(n,e,t){"use strict";function r(n){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}t.d(e,{Z:function(){return r}})},77505:function(n,e,t){"use strict";t.r(e);var r=t(85772),o=(t(22244),t(1161),t(4863),t(93379)),i=t.n(o),c=t(21900),a=(i()(c.Z,{insert:"head",singleton:!1}),c.Z.locals,0);(0,r.Um)((function(){(0,r.GE)((function(){a+=1,(0,r.ge)("status").innerHTML="Empty clicks: ".concat(a,"<br>")}),"except")}))},85772:function(n,e,t){"use strict";t.d(e,{ge:function(){return o},J_:function(){return i},mf:function(){return c},Kn:function(){return a},Zw:function(){return u},t4:function(){return l},KT:function(){return f},jl:function(){return d},Fl:function(){return s},Os:function(){return p},ce:function(){return m},YP:function(){return h},re:function(){return g},e9:function(){return b},GN:function(){return v},QV:function(){return y},pn:function(){return x},$Z:function(){return w},wp:function(){return E},wm:function(){return S},NW:function(){return T},Bc:function(){return j},x0:function(){return k},kP:function(){return C},DJ:function(){return I},Uc:function(){return _},Vt:function(){return L},BE:function(){return O},SH:function(){return N},yd:function(){return A},DV:function(){return R},Ro:function(){return M},GE:function(){return Z},q_:function(){return U},gD:function(){return P},os:function(){return z},p5:function(){return B},oe:function(){return D},xb:function(){return X},Tc:function(){return F},px:function(){return H},e5:function(){return Y},YM:function(){return W},vs:function(){return G},L_:function(){return J},Um:function(){return K},l7:function(){return V},CU:function(){return q}});var r=t(90484),o=document.getElementById.bind(document);function i(n){return n instanceof Date&&!isNaN(n.valueOf())}function c(n){return n&&("[object Function]"==={}.toString.call(n)||"function"==typeof n)}function a(n){return"object"===(0,r.Z)(n)&&"[object Object]"===Object.prototype.toString.call(n)}function u(n){var e;return Array.isArray(n)?n.map(u):a(n)?(e={},Object.keys(n).forEach((function(t){e[t]=u(n[t])})),e):n}function l(n,e){n&&e&&"object"===(0,r.Z)(e)&&Object.keys(e).forEach((function(t){var r=e[t];if(Array.isArray(r))n[t]=r.map((function(n){return n}));else if(a(r))null!==n[t]&&void 0!==n[t]||(n[t]={}),l(n[t],r);else try{n[t]=r}catch(e){n.setAttribute&&n.setAttribute(t,r)}}))}function f(n,e){n&&a(e)&&Object.keys(e).forEach((function(t){n.setAttribute(t,e[t])}))}function d(n,e){n&&e&&(Array.isArray(e)?e:[e]).forEach((function(e){e&&n.appendChild(e)}))}function s(n,e){n&&e&&Object.keys(e).forEach((function(t){n.addEventListener(t,e[t])}))}function p(n,e){n&&e&&Object.keys(e).forEach((function(t){n.removeEventListener(t,e[t])}))}function m(n,e,t,r){if("string"!=typeof n)return null;var o=document.createElement(n);return o?(e&&l(o,e),t&&d(o,t),r&&s(o,r),o):null}function h(n,e,t,r){if("string"!=typeof n)return null;var o=document.createElementNS("http://www.w3.org/2000/svg",n);return e&&f(o,e),t&&d(o,t),r&&s(o,r),o}function g(n){var e="string"==typeof n?o(n):n;return e&&e.parentNode?e.parentNode.removeChild(e):null}function b(n){return 0===parseFloat(n)||!!(n/n)}function v(n){var e=parseInt(n,10);return!isNaN(e)&&n===e&&n.toString()===e.toString()}function y(n){return n?window.getComputedStyle?getComputedStyle(n,""):n.currentStyle:null}function x(n,e){for(var t="string"==typeof n?o(n):n;t&&t.nodeType&&9!==t.nodeType;){var r=y(t);if(!r||"none"===r.display||"hidden"===r.visibility)return!1;if(!0!==e)break;t=t.parentNode}return!!t}function w(n,e){var t="string"==typeof n?o(n):n;t&&t.classList&&(e?t.classList.remove("hidden"):t.classList.add("hidden"))}function E(n,e){var t="string"==typeof n?o(n):n;t&&(t.disabled=!e)}function S(n){if(!n)return 0;if(n.focus(),n.selectionStart)return n.selectionStart;if(document.selection){var e=document.selection.createRange(),t=e.duplicate();return e.collapse(!0),t.moveToElementText(n),t.setEndPoint("EndToEnd",e),t.text.length}return 0}function T(n){if(!n)return null;if("selectionStart"in n&&document.activeElement===n)return{start:n.selectionStart,end:n.selectionEnd};if(n.createTextRange){var e=document.selection.createRange();if(e.parentElement()===n){var t,r,o=n.createTextRange();for(o.moveToBookmark(e.getBookmark()),t=0;o.compareEndPoints("EndToStart",o)>0;o.moveEnd("character",-1))t+=1;for(o.setEndPoint("StartToStart",n.createTextRange()),r={start:0,end:t};o.compareEndPoints("EndToStart",o)>0;o.moveEnd("character",-1))r.start+=1,r.end+=1;return r}}return null}function j(n,e){if(n)if(n.createTextRange){var t=n.createTextRange();t.collapse(!0),t.moveEnd("character",e),t.moveStart("character",e),t.select()}else n.setSelectionRange&&n.setSelectionRange(e,e)}function k(n){if("string"!=typeof n||!n.length)return!1;var e=n.split(".");return 3===e.length&&!!(b(e[0])&&b(e[1])&&b(e[2]))&&!(e[0]<1||e[0]>31||e[1]<1||e[1]>12||e[2]<1970)}function C(n){if(!n||!n.options||-1===n.selectedIndex)return-1;var e=n.options[n.selectedIndex];return e.textContent?e.textContent:e.innerText}function I(n){return n&&n.options&&-1!==n.selectedIndex?n.options[n.selectedIndex].value:-1}function _(n,e,t){if(!n||!n.options||void 0===e)return!1;for(var r=e.toString(),o=0,i=n.options.length;o<i;o+=1){var c=n.options[o];if(c&&c.value===r)return n.multiple?c.selected=void 0===t||t:n.selectedIndex=o,!0}return!1}function L(n,e){return e&&e.parentNode?e.parentNode.insertBefore(n,e):null}function O(n,e){var t=e.parentNode,r=e.nextSibling;return r?t.insertBefore(n,r):t.appendChild(n)}function N(n,e){if(e&&n){var t=Array.isArray(e)?e:[e],r=n.firstChild;r?t.reduce((function(n,e){return L(e,n),e}),r):t.forEach((function(e){return n.appendChild(e)}))}}function A(n){if(n)for(;n.childNodes.length>0;)n.removeChild(n.childNodes[0])}function R(n,e){if((n=n||window.event).currentTarget||(n.currentTarget=e),n.target||(n.target=n.srcElement),n.relatedTarget||("mouseover"===n.type&&(n.relatedTarget=n.fromElement),"mouseout"===n.type&&(n.relatedTarget=n.toElement)),null===n.pageX&&null!==n.clientX){var t=document.documentElement,r=document.body;n.pageX=n.clientX+(t.scrollLeft||r&&r.scrollLeft||0),n.pageX-=t.clientLeft||0,n.pageY=n.clientY+(t.scrollTop||r&&r.scrollTop||0),n.pageY-=t.clientTop||0}return!n.which&&n.button&&(1&n.button?n.which=1:2&n.button?n.which=3:n.which=4&n.button?2:0),n}function M(n,e,t){var r=!0,i=Array.isArray(t)?t:[t];c(e)&&(n&&(r=i.every((function(e){var t=("string"==typeof e?o(e):e)||null;return t&&!t.contains(n.target)&&t!==n.target||!t}))),r&&e())}function Z(n,e){var t=null,r=n||null;document.documentElement&&(c(r)&&(t=function(n){M(n,r,e)}),document.documentElement.onclick=null,setTimeout((function(){document.documentElement.onclick=t})))}function U(n){for(var e=n,t=0,r=0;e;)t+=parseInt(e.offsetTop,10),r+=parseInt(e.offsetLeft,10),e=e.offsetParent;return{top:t,left:r}}function P(n){var e=n.getBoundingClientRect(),t=document.body,r=document.documentElement,o=window.pageYOffset||r.scrollTop||t.scrollTop,i=window.pageXOffset||r.scrollLeft||t.scrollLeft,c=r.clientTop||t.clientTop||0,a=r.clientLeft||t.clientLeft||0,u=e.top+o-c,l=e.left+i-a;return{top:Math.round(u),left:Math.round(l)}}function z(n){return n.getBoundingClientRect?P(n):U(n)}function B(n,e){return n.compareDocumentPosition?n.compareDocumentPosition(e):(n!==e&&n.contains(e)&&16)+(n!==e&&e.contains(n)&&8)+(n.sourceIndex>=0&&e.sourceIndex>=0?(n.sourceIndex<e.sourceIndex&&4)+(n.sourceIndex>e.sourceIndex&&2):1)}function D(){if(void 0!==window.pageXOffset)return{left:pageXOffset,top:pageYOffset};var n=document.documentElement,e=document.body,t=n.scrollTop||e&&e.scrollTop||0;t-=n.clientTop;var r=n.scrollLeft||e&&e.scrollLeft||0;return{top:t,left:r-=n.clientLeft}}function X(n){return"object"!==(0,r.Z)(n)||0===Object.keys(n).length}function F(n){return"object"===(0,r.Z)(n)?Object.keys(n).length:0}function H(n){return"".concat(parseInt(n,10),"px")}function Y(n){var e=[];return a(n)?(Object.keys(n).forEach((function(t){var r=n[t];if(Array.isArray(r))r.forEach((function(n){if(!a(n)){var r=encodeURIComponent(t),o=encodeURIComponent(n.toString());e.push("".concat(r,"[]=").concat(o))}}));else if(!a(r)){var o=encodeURIComponent(t),i=encodeURIComponent(r.toString());e.push("".concat(o,"=").concat(i))}})),e.join("&")):""}function W(){if(document){if(document.head)return document.head;if(document.documentElement&&document.documentElement.firstChild)return document.documentElement.firstChild}return null}function G(n,e){n&&n.style&&(void 0!==n.style.webkitTransform?n.style.webkitTransform=e:void 0!==n.style.MozTransform?n.style.MozTransform=e:void 0!==n.style.msTransform?n.style.msTransform=e:void 0!==n.style.transform&&(n.style.transform=e))}function J(){return window.devicePixelRatio?window.devicePixelRatio:screen.deviceXDPI&&screen.logicalXDPI?screen.deviceXDPI/screen.logicalXDPI:screen.availWidth/document.documentElement.clientWidth}function K(n){K.readyList.length||function(n){var e=!1;function t(){e||(e=!0,function(){for(var n=0;n<K.readyList.length;n+=1)K.readyList[n]()}())}document.addEventListener?document.addEventListener("DOMContentLoaded",(function(){t()}),!1):document.attachEvent&&(document.documentElement.doScroll&&window===window.top&&function n(){if(!e&&document.body)try{document.documentElement.doScroll("left"),t()}catch(e){setTimeout(n,0)}}(),document.attachEvent("onreadystatechange",(function(){"complete"===document.readyState&&t()}))),window.addEventListener?window.addEventListener("load",t,!1):window.attachEvent&&window.attachEvent("onload",t)}(),K.readyList.push(n)}function V(n,e){function t(){}t.prototype=e.prototype,n.prototype=new t,n.prototype.constructor=n,n.parent=e.prototype}function q(n){n.prototype=Object.create(Error.prototype,{constructor:{value:Error,enumerable:!1,writable:!0,configurable:!0}}),Object.setPrototypeOf?Object.setPrototypeOf(n,Error):n.__proto__=Error}K.readyList=[]},24668:function(n,e,t){"use strict";var r=t(23645),o=t.n(r)()((function(n){return n[1]}));o.push([n.id,'* {\n  margin: 0;\n  padding: 0;\n  border: 0 none;\n}\n\n*,\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,\n    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",\n    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n\n/* Hide clear button inside inputs */\n::-ms-clear {\n  display: none;\n}\n\n/* WebKit focus fix */\n*:focus {\n  outline: none;\n}\n\n/* iOS Safari input height fix */\ninput[type="text"],\ninput[type="password"],\ninput[type="number"] {\n  overflow: hidden;\n}\n\ninput[type="button"],\ninput[type="submit"],\nbutton {\n  overflow: visible; /* IE button padding fix */\n  -webkit-appearance: button;\n          appearance: button; /* iOS Safari styling issue fix */\n}\n\n/* Firefox fix */\nbutton::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\n/* Hidden element */\n.hidden {\n  display: none !important;\n}\n\n/* Clearfix */\n.clearfix {\n  float: none;\n  clear: both;\n  display: table;\n  zoom: 1;\n}\n\n.clearfix::after {\n  content: ". .";\n  display: block;\n  word-spacing: 99in;\n  height: 0;\n  overflow: hidden;\n  font-size: 0.13em; /* Opera fix */\n  line-height: 0;\n}\n',""]),e.Z=o},28690:function(n,e,t){"use strict";var r=t(23645),o=t.n(r)()((function(n){return n[1]}));o.push([n.id,'/* Main layout */\r\nhtml,\r\nbody {\r\n  font-family:\r\n    -apple-system,\r\n    BlinkMacSystemFont,\r\n    "Segoe UI",\r\n    Roboto,\r\n    "Helvetica Neue",\r\n    Arial,\r\n    "Noto Sans",\r\n    sans-serif,\r\n    "Apple Color Emoji",\r\n    "Segoe UI Emoji",\r\n    "Segoe UI Symbol",\r\n    "Noto Color Emoji";\r\n  height: 100%;\r\n  border: 0 none;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n/* Main layout */\r\n.page {\r\n  display: table;\r\n  border-collapse: collapse;\r\n  position: relative;\r\n  width: 100%;\r\n  height: 100%;\r\n  min-height: 100%;\r\n}\r\n\r\n.page-wrapper {\r\n  display: table-cell;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n  position: static;\r\n}\r\n\r\n/* Main content */\r\n.page-container {\r\n  display: table;\r\n  table-layout: fixed;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.page-content {\r\n  display: table-cell;\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.page-content-wrap {\r\n  padding: 12px;\r\n}\r\n\r\n/* Typography */\r\nh1,\r\nh2,\r\nh3 {\r\n  font-family: "Segoe UI", Arial, sans-serif;\r\n  font-weight: normal;\r\n  padding: 10px 0 5px 0;\r\n}\r\n\r\nh1 {\r\n  font-size: 22px;\r\n}\r\n\r\nh2 {\r\n  font-size: 20px;\r\n}\r\n\r\nh3 {\r\n  font-size: 18px;\r\n}\r\n\r\n.btn,\r\n.btn:visited {\r\n  font-weight: normal;\r\n  font-size: 16px;\r\n  display: inline-block;\r\n  color: #ffffff;\r\n  background-color: #0072c6;\r\n  text-decoration: none;\r\n  border: 0 none;\r\n  padding: 4px 22px;\r\n  margin-right: 15px;\r\n  vertical-align: middle;\r\n  overflow: visible;\r\n  border-radius: 0;\r\n}\r\n\r\n.inp {\r\n  border: 1px solid #000000;\r\n  padding: 4px 8px;\r\n}\r\n\r\n/* Navigation */\r\n.nav-header {\r\n  background-color: #404040;\r\n  color: #ffffff;\r\n  padding: 12px;\r\n}\r\n\r\n.nav-header__logo {\r\n  padding: 6px 0;\r\n}\r\n\r\n.nav-header__logo > a {\r\n  text-decoration: none;\r\n  color: #dddddd;\r\n}\r\n\r\n.nav-header__logo > a:hover {\r\n  color: #ffffff;\r\n}\r\n\r\n.nav-header__menu-item {\r\n  display: inline;\r\n  padding: 0 10px 0 0;\r\n  font-size: 14px;\r\n}\r\n\r\n.nav-header__menu-item-active {\r\n  font-weight: bold;\r\n}\r\n\r\n/* Admin action button */\r\n.adm_act_btn {\r\n  padding: 3px 10px;\r\n  background-color: #44aaff;\r\n  color: #ffffff;\r\n}\r\n\r\n.adm_act_btn:disabled {\r\n  background-color: #708290;\r\n}\r\n',""]),e.Z=o},29014:function(n,e,t){"use strict";var r=t(23645),o=t.n(r)()((function(n){return n[1]}));o.push([n.id,'.page {\r\n  height: 100%;\r\n  width: 100%;\r\n  margin: 0;\r\n  padding: 12px;\r\n}\r\n\r\n.page_wrapper {\r\n  display: table;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n  position: relative;\r\n  border-collapse: collapse;\r\n}\r\n\r\n/* Main content */\r\n.container {\r\n  display: table-cell;\r\n  min-height: 100%;\r\n}\r\n\r\n.content {\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\nh2 {\r\n  font-family: "Segoe UI", Arial, sans-serif;\r\n  font-size: 20px;\r\n  font-weight: normal;\r\n  padding: 10px 0 5px 0;\r\n}\r\n\r\n.tests_content {\r\n  height: 100%;\r\n}\r\n\r\n.results,\r\n.testview,\r\n.ph {\r\n  display: inline-block;\r\n  float: left;\r\n  height: 100%;\r\n}\r\n\r\n.controls {\r\n  padding: 0 0 10px 0;\r\n}\r\n\r\n.btn {\r\n  padding: 3px 10px;\r\n  background-color: #44aaff;\r\n  color: #ffffff;\r\n}\r\n\r\n.tbl_container {\r\n  max-height: 700px;\r\n  overflow-y: auto;\r\n}\r\n\r\n.tbl_container table {\r\n  border-collapse: collapse;\r\n}\r\n\r\n.tbl_container td {\r\n  border: 1px solid #000000;\r\n  padding: 5px;\r\n}\r\n\r\n/* Admin table */\r\n.adm_tbl {\r\n  border-collapse: collapse;\r\n  border: 1px solid #000000;\r\n}\r\n\r\n.adm_tbl th,\r\n.adm_tbl td {\r\n  border: 1px solid #000000;\r\n  padding: 5px;\r\n}\r\n\r\n.adm_tbl tr {\r\n  cursor: pointer;\r\n}\r\n\r\n.adm_tbl tr:hover td {\r\n  background-color: #bbbbbb;\r\n}\r\n\r\n.adm_tbl.counter_tbl {\r\n  display: inline;\r\n  border: 0 none;\r\n}\r\n\r\n.counter_tbl td.title {\r\n  border-right: 0 none;\r\n}\r\n\r\n.counter_tbl td.title + td {\r\n  border-left: 0 none;\r\n}\r\n\r\n.results {\r\n  width: 40%;\r\n}\r\n\r\n.res-block-1 {\r\n  background-color: #005588;\r\n  color: #ffffff;\r\n}\r\n\r\n.res-block-2 {\r\n  background-color: #0099bb;\r\n}\r\n\r\n.res-block-3 {\r\n  background-color: #22ccff;\r\n}\r\n\r\n/* Test view */\r\n.testview {\r\n  width: 50%;\r\n  max-height: 730px;\r\n  overflow: hidden;\r\n}\r\n',""]),e.Z=o},21900:function(n,e,t){"use strict";var r=t(23645),o=t.n(r)()((function(n){return n[1]}));o.push([n.id,"#except {\r\n  display: block;\r\n  position: absolute;\r\n  width: 150px;\r\n  height: 150px;\r\n  color: #ffffff;\r\n  background-color: #2222bb;\r\n  top: 150px;\r\n  left: 100px;\r\n}\r\n",""]),e.Z=o},23645:function(n){"use strict";n.exports=function(n){var e=[];return e.toString=function(){return this.map((function(e){var t=n(e);return e[2]?"@media ".concat(e[2]," {").concat(t,"}"):t})).join("")},e.i=function(n,t,r){"string"==typeof n&&(n=[[null,n,""]]);var o={};if(r)for(var i=0;i<this.length;i++){var c=this[i][0];null!=c&&(o[c]=!0)}for(var a=0;a<n.length;a++){var u=[].concat(n[a]);r&&o[u[0]]||(t&&(u[2]?u[2]="".concat(t," and ").concat(u[2]):u[2]=t),e.push(u))}},e}},22244:function(n,e,t){"use strict";var r=t(93379),o=t.n(r),i=t(24668);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},4863:function(n,e,t){"use strict";var r=t(93379),o=t.n(r),i=t(28690);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},1161:function(n,e,t){"use strict";var r=t(93379),o=t.n(r),i=t(29014);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},93379:function(n,e,t){"use strict";var r,o=function(){var n={};return function(e){if(void 0===n[e]){var t=document.querySelector(e);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(n){t=null}n[e]=t}return n[e]}}(),i=[];function c(n){for(var e=-1,t=0;t<i.length;t++)if(i[t].identifier===n){e=t;break}return e}function a(n,e){for(var t={},r=[],o=0;o<n.length;o++){var a=n[o],u=e.base?a[0]+e.base:a[0],l=t[u]||0,f="".concat(u," ").concat(l);t[u]=l+1;var d=c(f),s={css:a[1],media:a[2],sourceMap:a[3]};-1!==d?(i[d].references++,i[d].updater(s)):i.push({identifier:f,updater:h(s,e),references:1}),r.push(f)}return r}function u(n){var e=document.createElement("style"),r=n.attributes||{};if(void 0===r.nonce){var i=t.nc;i&&(r.nonce=i)}if(Object.keys(r).forEach((function(n){e.setAttribute(n,r[n])})),"function"==typeof n.insert)n.insert(e);else{var c=o(n.insert||"head");if(!c)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");c.appendChild(e)}return e}var l,f=(l=[],function(n,e){return l[n]=e,l.filter(Boolean).join("\n")});function d(n,e,t,r){var o=t?"":r.media?"@media ".concat(r.media," {").concat(r.css,"}"):r.css;if(n.styleSheet)n.styleSheet.cssText=f(e,o);else{var i=document.createTextNode(o),c=n.childNodes;c[e]&&n.removeChild(c[e]),c.length?n.insertBefore(i,c[e]):n.appendChild(i)}}function s(n,e,t){var r=t.css,o=t.media,i=t.sourceMap;if(o?n.setAttribute("media",o):n.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),n.styleSheet)n.styleSheet.cssText=r;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(r))}}var p=null,m=0;function h(n,e){var t,r,o;if(e.singleton){var i=m++;t=p||(p=u(e)),r=d.bind(null,t,i,!1),o=d.bind(null,t,i,!0)}else t=u(e),r=s.bind(null,t,e),o=function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(t)};return r(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;r(n=e)}else o()}}n.exports=function(n,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=(void 0===r&&(r=Boolean(window&&document&&document.all&&!window.atob)),r));var t=a(n=n||[],e);return function(n){if(n=n||[],"[object Array]"===Object.prototype.toString.call(n)){for(var r=0;r<t.length;r++){var o=c(t[r]);i[o].references--}for(var u=a(n,e),l=0;l<t.length;l++){var f=c(t[l]);0===i[f].references&&(i[f].updater(),i.splice(f,1))}t=u}}}}},function(n){"use strict";return 77505,n(n.s=77505)}])}));