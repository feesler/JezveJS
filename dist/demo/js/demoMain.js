!function(n,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.jezvejs=e():n.jezvejs=e()}(self,(function(){return(self.webpackChunkjezvejs=self.webpackChunkjezvejs||[]).push([[872],{47362:function(n,e,t){"use strict";t.r(e),t(22244),t(1161),t(4863);var o=t(93379),i=t.n(o),r=t(10420);i()(r.Z,{insert:"head",singleton:!1}),r.Z.locals},24668:function(n,e,t){"use strict";var o=t(23645),i=t.n(o)()((function(n){return n[1]}));i.push([n.id,'* {\n  margin: 0;\n  padding: 0;\n  border: 0 none;\n}\n\n*,\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,\n    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",\n    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n\n/* Hide clear button inside inputs */\n::-ms-clear {\n  display: none;\n}\n\n/* WebKit focus fix */\n*:focus {\n  outline: none;\n}\n\ninput[type="button"],\ninput[type="submit"],\nbutton {\n  overflow: visible;    /* IE button padding fix */\n  -webkit-appearance: button;\n          appearance: button;   /* iOS Safari styling issue fix */\n}\n\n/* Firefox fix */\nbutton::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\n/* Hidden element */\n.hidden {\n  display: none !important;\n}\n\n/* Clearfix */\n.clearfix {\n  float: none;\n  clear: both;\n  display: table;\n  zoom: 1;\n}\n\n.clearfix::after {\n  content: ". .";\n  display: block;\n  word-spacing: 99in;\n  height: 0;\n  overflow: hidden;\n  font-size: 0.13em;      /* Opera fix */\n  line-height: 0;\n}\n',""]),e.Z=i},28690:function(n,e,t){"use strict";var o=t(23645),i=t.n(o)()((function(n){return n[1]}));i.push([n.id,'/* Main layout */\nhtml,\nbody {\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial,\n    "Noto Sans",\n    sans-serif,\n    "Apple Color Emoji",\n    "Segoe UI Emoji",\n    "Segoe UI Symbol",\n    "Noto Color Emoji";\n  height: 100%;\n  border: 0 none;\n  margin: 0;\n  padding: 0;\n}\n\n/* Main layout */\n.page {\n  display: table;\n  border-collapse: collapse;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n}\n\n.page-wrapper {\n  display: table-cell;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n  position: static;\n}\n\n/* Main content */\n.page-container {\n  display: table;\n  table-layout: fixed;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n}\n\n.page-content {\n  display: table-cell;\n  min-height: 100%;\n  height: 100%;\n}\n\n.page-content-wrap {\n  padding: 12px;\n}\n\n/* Typography */\nh1,\nh2,\nh3 {\n  font-family: "Segoe UI", Arial, sans-serif;\n  font-weight: normal;\n  padding: 10px 0 5px 0;\n}\n\nh1 {\n  font-size: 22px;\n}\n\nh2 {\n  font-size: 20px;\n}\n\nh3 {\n  font-size: 18px;\n}\n\n.btn,\n.btn:visited {\n  font-weight: normal;\n  font-size: 16px;\n  display: inline-block;\n  color: #ffffff;\n  background-color: #0072c6;\n  text-decoration: none;\n  border: 0 none;\n  padding: 4px 22px;\n  margin-right: 15px;\n  vertical-align: middle;\n  overflow: visible;\n  border-radius: 0;\n}\n\n.inp {\n  border: 1px solid #000000;\n  padding: 4px 8px;\n}\n\n/* Navigation */\n.nav-header {\n  background-color: #404040;\n  color: #ffffff;\n  padding: 12px;\n}\n\n.nav-header__logo {\n  padding: 6px 0;\n}\n\n.nav-header__logo > a {\n  text-decoration: none;\n  color: #dddddd;\n}\n\n.nav-header__logo > a:hover {\n  color: #ffffff;\n}\n\n.nav-header__menu-item {\n  display: inline;\n  padding: 0 10px 0 0;\n  font-size: 14px;\n}\n\n.nav-header__menu-item-active {\n  font-weight: bold;\n}\n\n/* Admin action button */\n.adm_act_btn {\n  padding: 3px 10px;\n  background-color: #44aaff;\n  color: #ffffff;\n}\n\n.adm_act_btn:disabled {\n  background-color: #708290;\n}\n',""]),e.Z=i},29014:function(n,e,t){"use strict";var o=t(23645),i=t.n(o)()((function(n){return n[1]}));i.push([n.id,'.page {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 12px;\n}\n\n.page_wrapper {\n  display: table;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n  position: relative;\n  border-collapse: collapse;\n}\n\n/* Main content */\n.container {\n  display: table-cell;\n  min-height: 100%;\n}\n\n.content {\n  min-height: 100%;\n  height: 100%;\n}\n\nh2 {\n  font-family: "Segoe UI", Arial, sans-serif;\n  font-size: 20px;\n  font-weight: normal;\n  padding: 10px 0 5px 0;\n}\n\n.tests_content {\n  height: 100%;\n}\n\n.results,\n.testview,\n.ph {\n  display: inline-block;\n  float: left;\n  height: 100%;\n}\n\n.controls {\n  padding: 0 0 10px 0;\n}\n\n.btn {\n  padding: 3px 10px;\n  background-color: #44aaff;\n  color: #ffffff;\n}\n\n.tbl_container {\n  max-height: 700px;\n  overflow-y: auto;\n}\n\n.tbl_container table {\n  border-collapse: collapse;\n}\n\n.tbl_container td {\n  border: 1px solid #000000;\n  padding: 5px;\n}\n\n/* Admin table */\n.adm_tbl {\n  border-collapse: collapse;\n  border: 1px solid #000000;\n}\n\n.adm_tbl th,\n.adm_tbl td {\n  border: 1px solid #000000;\n  padding: 5px;\n}\n\n.adm_tbl tr {\n  cursor: pointer;\n}\n\n.adm_tbl tr:hover td {\n  background-color: #bbbbbb;\n}\n\n.adm_tbl.counter_tbl {\n  display: inline;\n  border: 0 none;\n}\n\n.counter_tbl td.title {\n  border-right: 0 none;\n}\n\n.counter_tbl td.title + td {\n  border-left: 0 none;\n}\n\n.results {\n  width: 40%;\n}\n\n.res-block-1 {\n  background-color: #005588;\n  color: #ffffff;\n}\n\n.res-block-2 {\n  background-color: #0099bb;\n}\n\n.res-block-3 {\n  background-color: #22ccff;\n}\n\n/* Test view */\n.testview {\n  width: 50%;\n  max-height: 730px;\n  overflow: hidden;\n}\n',""]),e.Z=i},10420:function(n,e,t){"use strict";var o=t(23645),i=t.n(o)()((function(n){return n[1]}));i.push([n.id,".main-menu li {\n  margin-left: 16px;\n  list-style-type: none;\n}\n\n.main-menu li a,\n.main-menu li a:visited {\n  text-decoration: none;\n  font-size: 18px;\n  color: #0072c6;\n}\n\n.main-menu li a:hover {\n  text-decoration: underline;\n  color: #0093ff;\n}\n",""]),e.Z=i},23645:function(n){"use strict";n.exports=function(n){var e=[];return e.toString=function(){return this.map((function(e){var t=n(e);return e[2]?"@media ".concat(e[2]," {").concat(t,"}"):t})).join("")},e.i=function(n,t,o){"string"==typeof n&&(n=[[null,n,""]]);var i={};if(o)for(var r=0;r<this.length;r++){var a=this[r][0];null!=a&&(i[a]=!0)}for(var l=0;l<n.length;l++){var s=[].concat(n[l]);o&&i[s[0]]||(t&&(s[2]?s[2]="".concat(t," and ").concat(s[2]):s[2]=t),e.push(s))}},e}},22244:function(n,e,t){"use strict";var o=t(93379),i=t.n(o),r=t(24668);i()(r.Z,{insert:"head",singleton:!1}),r.Z.locals},4863:function(n,e,t){"use strict";var o=t(93379),i=t.n(o),r=t(28690);i()(r.Z,{insert:"head",singleton:!1}),r.Z.locals},1161:function(n,e,t){"use strict";var o=t(93379),i=t.n(o),r=t(29014);i()(r.Z,{insert:"head",singleton:!1}),r.Z.locals},93379:function(n,e,t){"use strict";var o,i=function(){var n={};return function(e){if(void 0===n[e]){var t=document.querySelector(e);if(window.HTMLIFrameElement&&t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(n){t=null}n[e]=t}return n[e]}}(),r=[];function a(n){for(var e=-1,t=0;t<r.length;t++)if(r[t].identifier===n){e=t;break}return e}function l(n,e){for(var t={},o=[],i=0;i<n.length;i++){var l=n[i],s=e.base?l[0]+e.base:l[0],c=t[s]||0,d="".concat(s," ").concat(c);t[s]=c+1;var f=a(d),p={css:l[1],media:l[2],sourceMap:l[3]};-1!==f?(r[f].references++,r[f].updater(p)):r.push({identifier:d,updater:b(p,e),references:1}),o.push(d)}return o}function s(n){var e=document.createElement("style"),o=n.attributes||{};if(void 0===o.nonce){var r=t.nc;r&&(o.nonce=r)}if(Object.keys(o).forEach((function(n){e.setAttribute(n,o[n])})),"function"==typeof n.insert)n.insert(e);else{var a=i(n.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(e)}return e}var c,d=(c=[],function(n,e){return c[n]=e,c.filter(Boolean).join("\n")});function f(n,e,t,o){var i=t?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(n.styleSheet)n.styleSheet.cssText=d(e,i);else{var r=document.createTextNode(i),a=n.childNodes;a[e]&&n.removeChild(a[e]),a.length?n.insertBefore(r,a[e]):n.appendChild(r)}}function p(n,e,t){var o=t.css,i=t.media,r=t.sourceMap;if(i?n.setAttribute("media",i):n.removeAttribute("media"),r&&"undefined"!=typeof btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(r))))," */")),n.styleSheet)n.styleSheet.cssText=o;else{for(;n.firstChild;)n.removeChild(n.firstChild);n.appendChild(document.createTextNode(o))}}var u=null,h=0;function b(n,e){var t,o,i;if(e.singleton){var r=h++;t=u||(u=s(e)),o=f.bind(null,t,r,!1),i=f.bind(null,t,r,!0)}else t=s(e),o=p.bind(null,t,e),i=function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(t)};return o(n),function(e){if(e){if(e.css===n.css&&e.media===n.media&&e.sourceMap===n.sourceMap)return;o(n=e)}else i()}}n.exports=function(n,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=(void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o));var t=l(n=n||[],e);return function(n){if(n=n||[],"[object Array]"===Object.prototype.toString.call(n)){for(var o=0;o<t.length;o++){var i=a(t[o]);r[i].references--}for(var s=l(n,e),c=0;c<t.length;c++){var d=a(t[c]);0===r[d].references&&(r[d].updater(),r.splice(d,1))}t=s}}}}},function(n){"use strict";return 47362,n(n.s=47362)}])}));