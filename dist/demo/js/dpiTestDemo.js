(self.webpackChunkjezvejs=self.webpackChunkjezvejs||[]).push([[673],{90484:function(n,e,r){"use strict";function t(n){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(n)}r.d(e,{Z:function(){return t}})},51389:function(n,e,r){"use strict";var t=r(85772),o=(r(22244),r(1161),r(4863),r(93379)),i=r.n(o),a=r(57820);i()(a.Z,{insert:"head",singleton:!1}),a.Z.locals,(0,t.Um)((function(){var n=(0,t.L_)();(0,t.ge)("testpic").classList.add(n>1?"pic-double":"pic-single"),(0,t.ge)("status").textContent="Real DPI: ".concat(n)}))},85772:function(n,e,r){"use strict";r.d(e,{ge:function(){return o},J_:function(){return i},mf:function(){return a},Kn:function(){return c},Zw:function(){return u},t4:function(){return l},jl:function(){return s},Fl:function(){return d},Os:function(){return f},ce:function(){return p},YP:function(){return m},re:function(){return h},e9:function(){return g},GN:function(){return b},pn:function(){return y},$Z:function(){return x},NW:function(){return w},Bc:function(){return E},DJ:function(){return S},Uc:function(){return k},Vt:function(){return T},BE:function(){return _},SH:function(){return I},yd:function(){return C},GE:function(){return j},os:function(){return N},p5:function(){return L},px:function(){return A},vs:function(){return M},L_:function(){return O},Um:function(){return R}});var t=r(90484),o=document.getElementById.bind(document);function i(n){return n instanceof Date&&!isNaN(n.valueOf())}function a(n){return n&&("[object Function]"==={}.toString.call(n)||"function"==typeof n)}function c(n){return"object"===(0,t.Z)(n)&&"[object Object]"===Object.prototype.toString.call(n)}function u(n){var e;return Array.isArray(n)?n.map(u):c(n)?(e={},Object.keys(n).forEach((function(r){e[r]=u(n[r])})),e):n}function l(n,e){n&&e&&"object"===(0,t.Z)(e)&&Object.keys(e).forEach((function(r){var t=e[r];if(Array.isArray(t))n[r]=t.map((function(n){return n}));else if(c(t))null!==n[r]&&void 0!==n[r]||(n[r]={}),l(n[r],t);else try{n[r]=t}catch(e){n.setAttribute&&n.setAttribute(r,t)}}))}function s(n,e){n&&e&&(Array.isArray(e)?e:[e]).forEach((function(e){e&&n.appendChild(e)}))}function d(n,e){n&&e&&Object.keys(e).forEach((function(r){n.addEventListener(r,e[r])}))}function f(n,e){n&&e&&Object.keys(e).forEach((function(r){n.removeEventListener(r,e[r])}))}function p(n,e,r,t){if("string"!=typeof n)return null;var o=document.createElement(n);return o?(e&&l(o,e),r&&s(o,r),t&&d(o,t),o):null}function m(n,e,r,t){if("string"!=typeof n)return null;var o,i,a=document.createElementNS("http://www.w3.org/2000/svg",n);return e&&(i=e,(o=a)&&c(i)&&Object.keys(i).forEach((function(n){o.setAttribute(n,i[n])}))),r&&s(a,r),t&&d(a,t),a}function h(n){var e="string"==typeof n?o(n):n;return e&&e.parentNode?e.parentNode.removeChild(e):null}function g(n){return 0===parseFloat(n)||!!(n/n)}function b(n){var e=parseInt(n,10);return!isNaN(e)&&n===e&&n.toString()===e.toString()}function v(n){return n?window.getComputedStyle?getComputedStyle(n,""):n.currentStyle:null}function y(n,e){for(var r="string"==typeof n?o(n):n;r&&r.nodeType&&9!==r.nodeType;){var t=v(r);if(!t||"none"===t.display||"hidden"===t.visibility)return!1;if(!0!==e)break;r=r.parentNode}return!!r}function x(n,e){var r="string"==typeof n?o(n):n;r&&r.classList&&(e?r.classList.remove("hidden"):r.classList.add("hidden"))}function w(n){if(!n)return null;if("selectionStart"in n&&document.activeElement===n)return{start:n.selectionStart,end:n.selectionEnd};if(n.createTextRange){var e=document.selection.createRange();if(e.parentElement()===n){var r,t,o=n.createTextRange();for(o.moveToBookmark(e.getBookmark()),r=0;o.compareEndPoints("EndToStart",o)>0;o.moveEnd("character",-1))r+=1;for(o.setEndPoint("StartToStart",n.createTextRange()),t={start:0,end:r};o.compareEndPoints("EndToStart",o)>0;o.moveEnd("character",-1))t.start+=1,t.end+=1;return t}}return null}function E(n,e){if(n)if(n.createTextRange){var r=n.createTextRange();r.collapse(!0),r.moveEnd("character",e),r.moveStart("character",e),r.select()}else n.setSelectionRange&&n.setSelectionRange(e,e)}function S(n){return n&&n.options&&-1!==n.selectedIndex?n.options[n.selectedIndex].value:-1}function k(n,e,r){if(!n||!n.options||void 0===e)return!1;for(var t=e.toString(),o=0,i=n.options.length;o<i;o+=1){var a=n.options[o];if(a&&a.value===t)return n.multiple?a.selected=void 0===r||r:n.selectedIndex=o,!0}return!1}function T(n,e){return e&&e.parentNode?e.parentNode.insertBefore(n,e):null}function _(n,e){var r=e.parentNode,t=e.nextSibling;return t?r.insertBefore(n,t):r.appendChild(n)}function I(n,e){if(e&&n){var r=Array.isArray(e)?e:[e],t=n.firstChild;t?r.reduce((function(n,e){return T(e,n),e}),t):r.forEach((function(e){return n.appendChild(e)}))}}function C(n){if(n)for(;n.childNodes.length>0;)n.removeChild(n.childNodes[0])}function j(n,e){var r=null,t=n||null;document.documentElement&&(a(t)&&(r=function(n){!function(n,e,r){var t=!0,i=Array.isArray(r)?r:[r];a(e)&&(n&&(t=i.every((function(e){var r=("string"==typeof e?o(e):e)||null;return r&&!r.contains(n.target)&&r!==n.target||!r}))),t&&e())}(n,t,e)}),document.documentElement.onclick=null,setTimeout((function(){document.documentElement.onclick=r})))}function N(n){return n.getBoundingClientRect?function(n){var e=n.getBoundingClientRect(),r=document.body,t=document.documentElement,o=window.pageYOffset||t.scrollTop||r.scrollTop,i=window.pageXOffset||t.scrollLeft||r.scrollLeft,a=t.clientTop||r.clientTop||0,c=t.clientLeft||r.clientLeft||0,u=e.top+o-a,l=e.left+i-c;return{top:Math.round(u),left:Math.round(l)}}(n):function(n){for(var e=n,r=0,t=0;e;)r+=parseInt(e.offsetTop,10),t+=parseInt(e.offsetLeft,10),e=e.offsetParent;return{top:r,left:t}}(n)}function L(n,e){return n.compareDocumentPosition?n.compareDocumentPosition(e):(n!==e&&n.contains(e)&&16)+(n!==e&&e.contains(n)&&8)+(n.sourceIndex>=0&&e.sourceIndex>=0?(n.sourceIndex<e.sourceIndex&&4)+(n.sourceIndex>e.sourceIndex&&2):1)}function A(n){return"".concat(parseInt(n,10),"px")}function M(n,e){n&&n.style&&(void 0!==n.style.webkitTransform?n.style.webkitTransform=e:void 0!==n.style.MozTransform?n.style.MozTransform=e:void 0!==n.style.msTransform?n.style.msTransform=e:void 0!==n.style.transform&&(n.style.transform=e))}function O(){return window.devicePixelRatio?window.devicePixelRatio:screen.deviceXDPI&&screen.logicalXDPI?screen.deviceXDPI/screen.logicalXDPI:screen.availWidth/document.documentElement.clientWidth}function R(n){R.readyList.length||function(n){var e=!1;function r(){e||(e=!0,function(){for(var n=0;n<R.readyList.length;n+=1)R.readyList[n]()}())}document.addEventListener?document.addEventListener("DOMContentLoaded",(function(){r()}),!1):document.attachEvent&&(document.documentElement.doScroll&&window===window.top&&function n(){if(!e&&document.body)try{document.documentElement.doScroll("left"),r()}catch(e){setTimeout(n,0)}}(),document.attachEvent("onreadystatechange",(function(){"complete"===document.readyState&&r()}))),window.addEventListener?window.addEventListener("load",r,!1):window.attachEvent&&window.attachEvent("onload",r)}(),R.readyList.push(n)}R.readyList=[]},24668:function(n,e,r){"use strict";var t=r(23645),o=r.n(t)()((function(n){return n[1]}));o.push([n.id,'* {\n  margin: 0;\n  padding: 0;\n  border: 0 none;\n}\n\n*,\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,\n    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",\n    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n\n/* Hide clear button inside inputs */\n::-ms-clear {\n  display: none;\n}\n\n/* WebKit focus fix */\n*:focus {\n  outline: none;\n}\n\ninput[type="button"],\ninput[type="submit"],\nbutton {\n  overflow: visible;    /* IE button padding fix */\n  -webkit-appearance: button;\n          appearance: button;   /* iOS Safari styling issue fix */\n}\n\n/* Firefox fix */\nbutton::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\n/* Hidden element */\n.hidden {\n  display: none !important;\n}\n\n/* Clearfix */\n.clearfix {\n  float: none;\n  clear: both;\n  display: table;\n  zoom: 1;\n}\n\n.clearfix::after {\n  content: ". .";\n  display: block;\n  word-spacing: 99in;\n  height: 0;\n  overflow: hidden;\n  font-size: 0.13em;      /* Opera fix */\n  line-height: 0;\n}\n',""]),e.Z=o},28690:function(n,e,r){"use strict";var t=r(23645),o=r.n(t)()((function(n){return n[1]}));o.push([n.id,'/* Main layout */\r\nhtml,\r\nbody {\r\n  font-family:\r\n    -apple-system,\r\n    BlinkMacSystemFont,\r\n    "Segoe UI",\r\n    Roboto,\r\n    "Helvetica Neue",\r\n    Arial,\r\n    "Noto Sans",\r\n    sans-serif,\r\n    "Apple Color Emoji",\r\n    "Segoe UI Emoji",\r\n    "Segoe UI Symbol",\r\n    "Noto Color Emoji";\r\n  height: 100%;\r\n  border: 0 none;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n/* Main layout */\r\n.page {\r\n  display: table;\r\n  border-collapse: collapse;\r\n  position: relative;\r\n  width: 100%;\r\n  height: 100%;\r\n  min-height: 100%;\r\n}\r\n\r\n.page-wrapper {\r\n  display: table-cell;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n  position: static;\r\n}\r\n\r\n/* Main content */\r\n.page-container {\r\n  display: table;\r\n  table-layout: fixed;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.page-content {\r\n  display: table-cell;\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.page-content-wrap {\r\n  padding: 12px;\r\n}\r\n\r\n/* Typography */\r\nh1,\r\nh2,\r\nh3 {\r\n  font-family: "Segoe UI", Arial, sans-serif;\r\n  font-weight: normal;\r\n  padding: 10px 0 5px 0;\r\n}\r\n\r\nh1 {\r\n  font-size: 22px;\r\n}\r\n\r\nh2 {\r\n  font-size: 20px;\r\n}\r\n\r\nh3 {\r\n  font-size: 18px;\r\n}\r\n\r\n.btn,\r\n.btn:visited {\r\n  font-weight: normal;\r\n  font-size: 16px;\r\n  display: inline-block;\r\n  color: #ffffff;\r\n  background-color: #0072c6;\r\n  text-decoration: none;\r\n  border: 0 none;\r\n  padding: 4px 22px;\r\n  margin-right: 15px;\r\n  vertical-align: middle;\r\n  overflow: visible;\r\n  border-radius: 0;\r\n}\r\n\r\n.inp {\r\n  border: 1px solid #000000;\r\n  padding: 4px 8px;\r\n}\r\n\r\n/* Navigation */\r\n.nav-header {\r\n  background-color: #404040;\r\n  color: #ffffff;\r\n  padding: 12px;\r\n}\r\n\r\n.nav-header__logo {\r\n  padding: 6px 0;\r\n}\r\n\r\n.nav-header__logo > a {\r\n  text-decoration: none;\r\n  color: #dddddd;\r\n}\r\n\r\n.nav-header__logo > a:hover {\r\n  color: #ffffff;\r\n}\r\n\r\n.nav-header__menu-item {\r\n  display: inline;\r\n  padding: 0 10px 0 0;\r\n  font-size: 14px;\r\n}\r\n\r\n.nav-header__menu-item-active {\r\n  font-weight: bold;\r\n}\r\n\r\n/* Admin action button */\r\n.adm_act_btn {\r\n  padding: 3px 10px;\r\n  background-color: #44aaff;\r\n  color: #ffffff;\r\n}\r\n\r\n.adm_act_btn:disabled {\r\n  background-color: #708290;\r\n}\r\n',""]),e.Z=o},29014:function(n,e,r){"use strict";var t=r(23645),o=r.n(t)()((function(n){return n[1]}));o.push([n.id,'.page {\r\n  height: 100%;\r\n  width: 100%;\r\n  margin: 0;\r\n  padding: 12px;\r\n}\r\n\r\n.page_wrapper {\r\n  display: table;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n  position: relative;\r\n  border-collapse: collapse;\r\n}\r\n\r\n/* Main content */\r\n.container {\r\n  display: table-cell;\r\n  min-height: 100%;\r\n}\r\n\r\n.content {\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\nh2 {\r\n  font-family: "Segoe UI", Arial, sans-serif;\r\n  font-size: 20px;\r\n  font-weight: normal;\r\n  padding: 10px 0 5px 0;\r\n}\r\n\r\n.tests_content {\r\n  height: 100%;\r\n}\r\n\r\n.results,\r\n.testview,\r\n.ph {\r\n  display: inline-block;\r\n  float: left;\r\n  height: 100%;\r\n}\r\n\r\n.controls {\r\n  padding: 0 0 10px 0;\r\n}\r\n\r\n.btn {\r\n  padding: 3px 10px;\r\n  background-color: #44aaff;\r\n  color: #ffffff;\r\n}\r\n\r\n.tbl_container {\r\n  max-height: 700px;\r\n  overflow-y: auto;\r\n}\r\n\r\n.tbl_container table {\r\n  border-collapse: collapse;\r\n}\r\n\r\n.tbl_container td {\r\n  border: 1px solid #000000;\r\n  padding: 5px;\r\n}\r\n\r\n/* Admin table */\r\n.adm_tbl {\r\n  border-collapse: collapse;\r\n  border: 1px solid #000000;\r\n}\r\n\r\n.adm_tbl th,\r\n.adm_tbl td {\r\n  border: 1px solid #000000;\r\n  padding: 5px;\r\n}\r\n\r\n.adm_tbl tr {\r\n  cursor: pointer;\r\n}\r\n\r\n.adm_tbl tr:hover td {\r\n  background-color: #bbbbbb;\r\n}\r\n\r\n.adm_tbl.counter_tbl {\r\n  display: inline;\r\n  border: 0 none;\r\n}\r\n\r\n.counter_tbl td.title {\r\n  border-right: 0 none;\r\n}\r\n\r\n.counter_tbl td.title + td {\r\n  border-left: 0 none;\r\n}\r\n\r\n.results {\r\n  width: 40%;\r\n}\r\n\r\n.res-block-1 {\r\n  background-color: #005588;\r\n  color: #ffffff;\r\n}\r\n\r\n.res-block-2 {\r\n  background-color: #0099bb;\r\n}\r\n\r\n.res-block-3 {\r\n  background-color: #22ccff;\r\n}\r\n\r\n/* Test view */\r\n.testview {\r\n  width: 50%;\r\n  max-height: 730px;\r\n  overflow: hidden;\r\n}\r\n',""]),e.Z=o},57820:function(n,e,r){"use strict";var t=r(23645),o=r.n(t),i=r(61667),a=r.n(i),c=r(46422),u=r(11482),l=o()((function(n){return n[1]})),s=a()(c),d=a()(u);l.push([n.id,".pic {\r\n  width: 100px;\r\n  height: 100px;\r\n  background-repeat: no-repeat;\r\n}\r\n\r\n.pic-single {\r\n  background-image: url("+s+");\r\n}\r\n\r\n.pic-double {\r\n  background-image: url("+d+");\r\n  background-size: 100px 100px;\r\n}\r\n",""]),e.Z=l},23645:function(n){"use strict";n.exports=function(n){var e=[];return e.toString=function(){return this.map((function(e){var r=n(e);return e[2]?"@media ".concat(e[2]," {").concat(r,"}"):r})).join("")},e.i=function(n,r,t){"string"==typeof n&&(n=[[null,n,""]]);var o={};if(t)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var c=0;c<n.length;c++){var u=[].concat(n[c]);t&&o[u[0]]||(r&&(u[2]?u[2]="".concat(r," and ").concat(u[2]):u[2]=r),e.push(u))}},e}},61667:function(n){"use strict";n.exports=function(n,e){return e||(e={}),"string"!=typeof(n=n&&n.__esModule?n.default:n)?n:(/^['"].*['"]$/.test(n)&&(n=n.slice(1,-1)),e.hash&&(n+=e.hash),/["'() \t\n]/.test(n)||e.needQuotes?'"'.concat(n.replace(/"/g,'\\"').replace(/\n/g,"\\n"),'"'):n)}},22244:function(n,e,r){"use strict";var t=r(93379),o=r.n(t),i=r(24668);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},4863:function(n,e,r){"use strict";var t=r(93379),o=r.n(t),i=r(28690);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},1161:function(n,e,r){"use strict";var t=r(93379),o=r.n(t),i=r(29014);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},93379:function(n,e,r){"use strict";var t,o=function(){var n={};return function(e){if(void 0===n[e]){var r=document.querySelector(e);if(window.HTMLIFrameElement&&r instanceof window.HTMLIFrameElement)try{r=r.contentDocument.head}catch(n){r=null}n[e]=r}return n[e]}}(),i=[];function a(n){for(var e=-1,r=0;r<i.length;r++)if(i[r].identifier===n){e=r;break}return e}function c(n,e){for(var r={},t=[],o=0;o<n.length;o++){var c=n[o],u=e.base?c[0]+e.base:c[0],l=r[u]||0,s="".concat(u," ").concat(l);r[u]=l+1;var d=a(s),f={css:c[1],media:c[2],sourceMap:c[3]};-1!==d?(i[d].references++,i[d].updater(f)):i.push({identifier:s,updater:h(f,e),references:1}),t.push(s)}return t}function u(n){var e=document.createElement("style"),t=n.attributes||{};if(void 0===t.nonce){var i=r.nc;i&&(t.nonce=i)}if(Object.keys(t).forEach((function(n){e.setAttribute(n,t[n])})),"function"==typeof n.insert)n.insert(e);else{var a=o(n.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(e)}return e}var l,s=(l=[],function(n,e){return l[n]=e,l.filter(Boolean).join("\n")});function d(n,e,r,t){var o=r?"":t.media?"@media ".concat(t.media," {").concat(t.css,"}"):t.css;if(n.styleSheet)n.styleSheet.cssText=s(e,o);else{var i=document.createTextNode(o),a=n.childNodes;a[e]&&n.removeChild(a[e]),a.length?n.insertBefore(i,a[e]):n.appendChild(i)}}function f(n,e,r){var t=r.css,o=r.media,i=r.sourceMap;if(o?n.setAttribute("media",o):n.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(t+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),n.styleSheet)n.styleSheet.cssText=t;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(t))}}var p=null,m=0;function h(n,e){var r,t,o;if(e.singleton){var i=m++;r=p||(p=u(e)),t=d.bind(null,r,i,!1),o=d.bind(null,r,i,!0)}else r=u(e),t=f.bind(null,r,e),o=function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(r)};return t(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;t(n=e)}else o()}}n.exports=function(n,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=(void 0===t&&(t=Boolean(window&&document&&document.all&&!window.atob)),t));var r=c(n=n||[],e);return function(n){if(n=n||[],"[object Array]"===Object.prototype.toString.call(n)){for(var t=0;t<r.length;t++){var o=a(r[t]);i[o].references--}for(var u=c(n,e),l=0;l<r.length;l++){var s=a(r[l]);0===i[s].references&&(i[s].updater(),i.splice(s,1))}r=u}}}},46422:function(n,e,r){"use strict";n.exports=r.p+"cdc781036f2ebf3fa467.png"},11482:function(n,e,r){"use strict";n.exports=r.p+"01c855947aa96d405522.png"}},function(n){"use strict";n(n.s=51389)}]);