!function(n,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.jezvejs=e():n.jezvejs=e()}(self,(function(){return(self.webpackChunkjezvejs=self.webpackChunkjezvejs||[]).push([[355],{70669:function(n,e,t){"use strict";t.r(e);var o=t(85772),a=t(75433),i=(t(22244),t(1161),t(4863),t(93379)),r=t.n(i),l=t(13704),c=(r()(l.Z,{insert:"head",singleton:!1}),l.Z.locals,null),d=null,p=null,s=null;function f(n){var e=(0,o.ge)("dateinp");e&&(e.value=a.DatePicker.format(n))}function u(n){var e=(0,o.ge)("dateinp2");e&&(e.value=a.DatePicker.format(n)),c.hide()}function g(){c.show()}function b(n){var e=(0,o.ge)("rangeinp");if(e){var t=a.DatePicker.format(n.start),i=a.DatePicker.format(n.end);e.value="".concat(t," - ").concat(i)}d.hide()}function h(){d.show()}function m(n){var e=(0,o.ge)("cbinp");if(e){var t=a.DatePicker.format(n.start),i=a.DatePicker.format(n.end);e.value="".concat(t," - ").concat(i)}}function x(n){var e=(0,o.ge)("statustext");e&&(e.textContent="Date selected: ".concat(a.DatePicker.format(n)))}function v(){p.show()}function y(){s.show()}function k(){var n=(0,o.ge)("statustext");n&&(n.textContent="Loading...")}(0,o.Um)((function(){a.DatePicker.create({wrapper:"calendar",static:!0,animated:!0,ondateselect:f}),c=a.DatePicker.create({wrapper:"calendar2",relparent:"dategroup2",ondateselect:u}),(0,o.ge)("calbtn2").onclick=g,d=a.DatePicker.create({wrapper:"calendar3",relparent:"dategroup3",range:!0,onrangeselect:b}),(0,o.ge)("calbtn3").onclick=h,p=a.DatePicker.create({wrapper:"calendar4",relparent:"dategroup4",range:!0,ondateselect:x,onrangeselect:m,onhide:k}),(0,o.ge)("calbtn4").onclick=v,(s=a.DatePicker.create({wrapper:"calendar5",relparent:"dategroup5",range:!0})).setSelection("01.12.2020","07.12.2020"),(0,o.ge)("calbtn5").onclick=y}))},24668:function(n,e,t){"use strict";var o=t(23645),a=t.n(o)()((function(n){return n[1]}));a.push([n.id,'* {\n  margin: 0;\n  padding: 0;\n  border: 0 none;\n}\n\n*,\nbody {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,\n    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",\n    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n}\n\n/* Hide clear button inside inputs */\n::-ms-clear {\n  display: none;\n}\n\n/* WebKit focus fix */\n*:focus {\n  outline: none;\n}\n\ninput[type="button"],\ninput[type="submit"],\nbutton {\n  overflow: visible;    /* IE button padding fix */\n  -webkit-appearance: button;\n          appearance: button;   /* iOS Safari styling issue fix */\n}\n\n/* Firefox fix */\nbutton::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\n/* Hidden element */\n.hidden {\n  display: none !important;\n}\n\n/* Clearfix */\n.clearfix {\n  float: none;\n  clear: both;\n  display: table;\n  zoom: 1;\n}\n\n.clearfix::after {\n  content: ". .";\n  display: block;\n  word-spacing: 99in;\n  height: 0;\n  overflow: hidden;\n  font-size: 0.13em;      /* Opera fix */\n  line-height: 0;\n}\n',""]),e.Z=a},28690:function(n,e,t){"use strict";var o=t(23645),a=t.n(o)()((function(n){return n[1]}));a.push([n.id,'/* Main layout */\nhtml,\nbody {\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    "Helvetica Neue",\n    Arial,\n    "Noto Sans",\n    sans-serif,\n    "Apple Color Emoji",\n    "Segoe UI Emoji",\n    "Segoe UI Symbol",\n    "Noto Color Emoji";\n  height: 100%;\n  border: 0 none;\n  margin: 0;\n  padding: 0;\n}\n\n/* Main layout */\n.page {\n  display: table;\n  border-collapse: collapse;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 100%;\n}\n\n.page-wrapper {\n  display: table-cell;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n  position: static;\n}\n\n/* Main content */\n.page-container {\n  display: table;\n  table-layout: fixed;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n}\n\n.page-content {\n  display: table-cell;\n  min-height: 100%;\n  height: 100%;\n}\n\n.page-content-wrap {\n  padding: 12px;\n}\n\n/* Typography */\nh1,\nh2,\nh3 {\n  font-family: "Segoe UI", Arial, sans-serif;\n  font-weight: normal;\n  padding: 10px 0 5px 0;\n}\n\nh1 {\n  font-size: 22px;\n}\n\nh2 {\n  font-size: 20px;\n}\n\nh3 {\n  font-size: 18px;\n}\n\n.btn,\n.btn:visited {\n  font-weight: normal;\n  font-size: 16px;\n  display: inline-block;\n  color: #ffffff;\n  background-color: #0072c6;\n  text-decoration: none;\n  border: 0 none;\n  padding: 4px 22px;\n  margin-right: 15px;\n  vertical-align: middle;\n  overflow: visible;\n  border-radius: 0;\n}\n\n.inp {\n  border: 1px solid #000000;\n  padding: 4px 8px;\n}\n\n/* Navigation */\n.nav-header {\n  background-color: #404040;\n  color: #ffffff;\n  padding: 12px;\n}\n\n.nav-header__logo {\n  padding: 6px 0;\n}\n\n.nav-header__logo > a {\n  text-decoration: none;\n  color: #dddddd;\n}\n\n.nav-header__logo > a:hover {\n  color: #ffffff;\n}\n\n.nav-header__menu-item {\n  display: inline;\n  padding: 0 10px 0 0;\n  font-size: 14px;\n}\n\n.nav-header__menu-item-active {\n  font-weight: bold;\n}\n\n/* Admin action button */\n.adm_act_btn {\n  padding: 3px 10px;\n  background-color: #44aaff;\n  color: #ffffff;\n}\n\n.adm_act_btn:disabled {\n  background-color: #708290;\n}\n',""]),e.Z=a},29014:function(n,e,t){"use strict";var o=t(23645),a=t.n(o)()((function(n){return n[1]}));a.push([n.id,'.page {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 12px;\n}\n\n.page_wrapper {\n  display: table;\n  width: 100%;\n  min-height: 100%;\n  height: 100%;\n  position: relative;\n  border-collapse: collapse;\n}\n\n/* Main content */\n.container {\n  display: table-cell;\n  min-height: 100%;\n}\n\n.content {\n  min-height: 100%;\n  height: 100%;\n}\n\nh2 {\n  font-family: "Segoe UI", Arial, sans-serif;\n  font-size: 20px;\n  font-weight: normal;\n  padding: 10px 0 5px 0;\n}\n\n.tests_content {\n  height: 100%;\n}\n\n.results,\n.testview,\n.ph {\n  display: inline-block;\n  float: left;\n  height: 100%;\n}\n\n.controls {\n  padding: 0 0 10px 0;\n}\n\n.btn {\n  padding: 3px 10px;\n  background-color: #44aaff;\n  color: #ffffff;\n}\n\n.tbl_container {\n  max-height: 700px;\n  overflow-y: auto;\n}\n\n.tbl_container table {\n  border-collapse: collapse;\n}\n\n.tbl_container td {\n  border: 1px solid #000000;\n  padding: 5px;\n}\n\n/* Admin table */\n.adm_tbl {\n  border-collapse: collapse;\n  border: 1px solid #000000;\n}\n\n.adm_tbl th,\n.adm_tbl td {\n  border: 1px solid #000000;\n  padding: 5px;\n}\n\n.adm_tbl tr {\n  cursor: pointer;\n}\n\n.adm_tbl tr:hover td {\n  background-color: #bbbbbb;\n}\n\n.adm_tbl.counter_tbl {\n  display: inline;\n  border: 0 none;\n}\n\n.counter_tbl td.title {\n  border-right: 0 none;\n}\n\n.counter_tbl td.title + td {\n  border-left: 0 none;\n}\n\n.results {\n  width: 40%;\n}\n\n.res-block-1 {\n  background-color: #005588;\n  color: #ffffff;\n}\n\n.res-block-2 {\n  background-color: #0099bb;\n}\n\n.res-block-3 {\n  background-color: #22ccff;\n}\n\n/* Test view */\n.testview {\n  width: 50%;\n  max-height: 730px;\n  overflow: hidden;\n}\n',""]),e.Z=a},13704:function(n,e,t){"use strict";var o=t(23645),a=t.n(o)()((function(n){return n[1]}));a.push([n.id,'input[type="text"] {\n  border: 1px solid #000000;\n  padding: 5px;\n}\n\n.calBtn {\n  padding: 5px;\n}\n',""]),e.Z=a},22244:function(n,e,t){"use strict";var o=t(93379),a=t.n(o),i=t(24668);a()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},4863:function(n,e,t){"use strict";var o=t(93379),a=t.n(o),i=t(28690);a()(i.Z,{insert:"head",singleton:!1}),i.Z.locals},1161:function(n,e,t){"use strict";var o=t(93379),a=t.n(o),i=t(29014);a()(i.Z,{insert:"head",singleton:!1}),i.Z.locals}},function(n){"use strict";return n.O(0,[576],(function(){return 70669,n(n.s=70669)})),n.O()}])}));