!function(n,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("jezvejs",[],r):"object"==typeof exports?exports.jezvejs=r():n.jezvejs=r()}(self,(function(){return(self.webpackChunkjezvejs=self.webpackChunkjezvejs||[]).push([[872],{47362:function(n,r,e){"use strict";e.r(r),e(22244),e(1161),e(4863);var t=e(93379),o=e.n(t),i=e(10420);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},24668:function(n,r,e){"use strict";var t=e(23645),o=e.n(t)()((function(n){return n[1]}));o.push([n.id,'* {\n  margin: 0;\n  padding: 0;\n  border: 0 none;\n}\n\n*,\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,\n    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",\n    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n\n/* Hide clear button inside inputs */\n::-ms-clear {\n  display: none;\n}\n\n/* WebKit focus fix */\n*:focus {\n  outline: none;\n}\n\n/* iOS Safari input height fix */\ninput[type="text"],\ninput[type="password"],\ninput[type="number"] {\n  overflow: hidden;\n}\n\ninput[type="button"],\ninput[type="submit"],\nbutton {\n  overflow: visible; /* IE button padding fix */\n  -webkit-appearance: button;\n          appearance: button; /* iOS Safari styling issue fix */\n}\n\n/* Firefox fix */\nbutton::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\n/* Hidden element */\n.hidden {\n  display: none !important;\n}\n\n/* Clearfix */\n.clearfix {\n  float: none;\n  clear: both;\n  display: table;\n  zoom: 1;\n}\n\n.clearfix::after {\n  content: ". .";\n  display: block;\n  word-spacing: 99in;\n  height: 0;\n  overflow: hidden;\n  font-size: 0.13em; /* Opera fix */\n  line-height: 0;\n}\n',""]),r.Z=o},28690:function(n,r,e){"use strict";var t=e(23645),o=e.n(t)()((function(n){return n[1]}));o.push([n.id,'/* Main layout */\r\nhtml,\r\nbody {\r\n  font-family:\r\n    -apple-system,\r\n    BlinkMacSystemFont,\r\n    "Segoe UI",\r\n    Roboto,\r\n    "Helvetica Neue",\r\n    Arial,\r\n    "Noto Sans",\r\n    sans-serif,\r\n    "Apple Color Emoji",\r\n    "Segoe UI Emoji",\r\n    "Segoe UI Symbol",\r\n    "Noto Color Emoji";\r\n  height: 100%;\r\n  border: 0 none;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n/* Main layout */\r\n.page {\r\n  display: table;\r\n  border-collapse: collapse;\r\n  position: relative;\r\n  width: 100%;\r\n  height: 100%;\r\n  min-height: 100%;\r\n}\r\n\r\n.page-wrapper {\r\n  display: table-cell;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n  position: static;\r\n}\r\n\r\n/* Main content */\r\n.page-container {\r\n  display: table;\r\n  table-layout: fixed;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.page-content {\r\n  display: table-cell;\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.page-content-wrap {\r\n  padding: 12px;\r\n}\r\n\r\n/* Typography */\r\nh1,\r\nh2,\r\nh3 {\r\n  font-family: "Segoe UI", Arial, sans-serif;\r\n  font-weight: normal;\r\n  padding: 10px 0 5px 0;\r\n}\r\n\r\nh1 {\r\n  font-size: 22px;\r\n}\r\n\r\nh2 {\r\n  font-size: 20px;\r\n}\r\n\r\nh3 {\r\n  font-size: 18px;\r\n}\r\n\r\n.btn,\r\n.btn:visited {\r\n  font-weight: normal;\r\n  font-size: 16px;\r\n  display: inline-block;\r\n  color: #ffffff;\r\n  background-color: #0072c6;\r\n  text-decoration: none;\r\n  border: 0 none;\r\n  padding: 4px 22px;\r\n  margin-right: 15px;\r\n  vertical-align: middle;\r\n  overflow: visible;\r\n  border-radius: 0;\r\n}\r\n\r\n.inp {\r\n  border: 1px solid #000000;\r\n  padding: 4px 8px;\r\n}\r\n\r\n/* Navigation */\r\n.nav-header {\r\n  background-color: #404040;\r\n  color: #ffffff;\r\n  padding: 12px;\r\n}\r\n\r\n.nav-header__logo {\r\n  padding: 6px 0;\r\n}\r\n\r\n.nav-header__logo > a {\r\n  text-decoration: none;\r\n  color: #dddddd;\r\n}\r\n\r\n.nav-header__logo > a:hover {\r\n  color: #ffffff;\r\n}\r\n\r\n.nav-header__menu-item {\r\n  display: inline;\r\n  padding: 0 10px 0 0;\r\n  font-size: 14px;\r\n}\r\n\r\n.nav-header__menu-item-active {\r\n  font-weight: bold;\r\n}\r\n\r\n/* Admin action button */\r\n.adm_act_btn {\r\n  padding: 3px 10px;\r\n  background-color: #44aaff;\r\n  color: #ffffff;\r\n}\r\n\r\n.adm_act_btn:disabled {\r\n  background-color: #708290;\r\n}\r\n',""]),r.Z=o},29014:function(n,r,e){"use strict";var t=e(23645),o=e.n(t)()((function(n){return n[1]}));o.push([n.id,'.page {\r\n  height: 100%;\r\n  width: 100%;\r\n  margin: 0;\r\n  padding: 12px;\r\n}\r\n\r\n.page_wrapper {\r\n  display: table;\r\n  width: 100%;\r\n  min-height: 100%;\r\n  height: 100%;\r\n  position: relative;\r\n  border-collapse: collapse;\r\n}\r\n\r\n/* Main content */\r\n.container {\r\n  display: table-cell;\r\n  min-height: 100%;\r\n}\r\n\r\n.content {\r\n  min-height: 100%;\r\n  height: 100%;\r\n}\r\n\r\nh2 {\r\n  font-family: "Segoe UI", Arial, sans-serif;\r\n  font-size: 20px;\r\n  font-weight: normal;\r\n  padding: 10px 0 5px 0;\r\n}\r\n\r\n.tests_content {\r\n  height: 100%;\r\n}\r\n\r\n.results,\r\n.testview,\r\n.ph {\r\n  display: inline-block;\r\n  float: left;\r\n  height: 100%;\r\n}\r\n\r\n.controls {\r\n  padding: 0 0 10px 0;\r\n}\r\n\r\n.btn {\r\n  padding: 3px 10px;\r\n  background-color: #44aaff;\r\n  color: #ffffff;\r\n}\r\n\r\n.tbl_container {\r\n  max-height: 700px;\r\n  overflow-y: auto;\r\n}\r\n\r\n.tbl_container table {\r\n  border-collapse: collapse;\r\n}\r\n\r\n.tbl_container td {\r\n  border: 1px solid #000000;\r\n  padding: 5px;\r\n}\r\n\r\n/* Admin table */\r\n.adm_tbl {\r\n  border-collapse: collapse;\r\n  border: 1px solid #000000;\r\n}\r\n\r\n.adm_tbl th,\r\n.adm_tbl td {\r\n  border: 1px solid #000000;\r\n  padding: 5px;\r\n}\r\n\r\n.adm_tbl tr {\r\n  cursor: pointer;\r\n}\r\n\r\n.adm_tbl tr:hover td {\r\n  background-color: #bbbbbb;\r\n}\r\n\r\n.adm_tbl.counter_tbl {\r\n  display: inline;\r\n  border: 0 none;\r\n}\r\n\r\n.counter_tbl td.title {\r\n  border-right: 0 none;\r\n}\r\n\r\n.counter_tbl td.title + td {\r\n  border-left: 0 none;\r\n}\r\n\r\n.results {\r\n  width: 40%;\r\n}\r\n\r\n.res-block-1 {\r\n  background-color: #005588;\r\n  color: #ffffff;\r\n}\r\n\r\n.res-block-2 {\r\n  background-color: #0099bb;\r\n}\r\n\r\n.res-block-3 {\r\n  background-color: #22ccff;\r\n}\r\n\r\n/* Test view */\r\n.testview {\r\n  width: 50%;\r\n  max-height: 730px;\r\n  overflow: hidden;\r\n}\r\n',""]),r.Z=o},10420:function(n,r,e){"use strict";var t=e(23645),o=e.n(t)()((function(n){return n[1]}));o.push([n.id,".main-menu li {\n  margin-left: 16px;\n  list-style-type: none;\n}\n\n.main-menu li a,\n.main-menu li a:visited {\n  text-decoration: none;\n  font-size: 18px;\n  color: #0072c6;\n}\n\n.main-menu li a:hover {\n  text-decoration: underline;\n  color: #0093ff;\n}\n",""]),r.Z=o},23645:function(n){"use strict";n.exports=function(n){var r=[];return r.toString=function(){return this.map((function(r){var e=n(r);return r[2]?"@media ".concat(r[2]," {").concat(e,"}"):e})).join("")},r.i=function(n,e,t){"string"==typeof n&&(n=[[null,n,""]]);var o={};if(t)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(o[a]=!0)}for(var l=0;l<n.length;l++){var s=[].concat(n[l]);t&&o[s[0]]||(e&&(s[2]?s[2]="".concat(e," and ").concat(s[2]):s[2]=e),r.push(s))}},r}},22244:function(n,r,e){"use strict";var t=e(93379),o=e.n(t),i=e(24668);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},4863:function(n,r,e){"use strict";var t=e(93379),o=e.n(t),i=e(28690);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},1161:function(n,r,e){"use strict";var t=e(93379),o=e.n(t),i=e(29014);o()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},93379:function(n,r,e){"use strict";var t,o=function(){var n={};return function(r){if(void 0===n[r]){var e=document.querySelector(r);if(window.HTMLIFrameElement&&e instanceof window.HTMLIFrameElement)try{e=e.contentDocument.head}catch(n){e=null}n[r]=e}return n[r]}}(),i=[];function a(n){for(var r=-1,e=0;e<i.length;e++)if(i[e].identifier===n){r=e;break}return r}function l(n,r){for(var e={},t=[],o=0;o<n.length;o++){var l=n[o],s=r.base?l[0]+r.base:l[0],d=e[s]||0,c="".concat(s," ").concat(d);e[s]=d+1;var f=a(c),p={css:l[1],media:l[2],sourceMap:l[3]};-1!==f?(i[f].references++,i[f].updater(p)):i.push({identifier:c,updater:b(p,r),references:1}),t.push(c)}return t}function s(n){var r=document.createElement("style"),t=n.attributes||{};if(void 0===t.nonce){var i=e.nc;i&&(t.nonce=i)}if(Object.keys(t).forEach((function(n){r.setAttribute(n,t[n])})),"function"==typeof n.insert)n.insert(r);else{var a=o(n.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(r)}return r}var d,c=(d=[],function(n,r){return d[n]=r,d.filter(Boolean).join("\n")});function f(n,r,e,t){var o=e?"":t.media?"@media ".concat(t.media," {").concat(t.css,"}"):t.css;if(n.styleSheet)n.styleSheet.cssText=c(r,o);else{var i=document.createTextNode(o),a=n.childNodes;a[r]&&n.removeChild(a[r]),a.length?n.insertBefore(i,a[r]):n.appendChild(i)}}function p(n,r,e){var t=e.css,o=e.media,i=e.sourceMap;if(o?n.setAttribute("media",o):n.removeAttribute("media"),i&&"undefined"!=typeof btoa&&(t+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),n.styleSheet)n.styleSheet.cssText=t;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(t))}}var u=null,h=0;function b(n,r){var e,t,o;if(r.singleton){var i=h++;e=u||(u=s(r)),t=f.bind(null,e,i,!1),o=f.bind(null,e,i,!0)}else e=s(r),t=p.bind(null,e,r),o=function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(e)};return t(n),function(r){if(r){if(r.css===n.css&&r.media===n.media&&r.sourceMap===n.sourceMap)return;t(n=r)}else o()}}n.exports=function(n,r){(r=r||{}).singleton||"boolean"==typeof r.singleton||(r.singleton=(void 0===t&&(t=Boolean(window&&document&&document.all&&!window.atob)),t));var e=l(n=n||[],r);return function(n){if(n=n||[],"[object Array]"===Object.prototype.toString.call(n)){for(var t=0;t<e.length;t++){var o=a(e[t]);i[o].references--}for(var s=l(n,r),d=0;d<e.length;d++){var c=a(e[d]);0===i[c].references&&(i[c].updater(),i.splice(c,1))}e=s}}}}},function(n){"use strict";return 47362,n(n.s=47362)}])}));