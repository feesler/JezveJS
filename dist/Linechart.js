!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("jezvejs",[],e):"object"==typeof exports?exports.jezvejs=e():t.jezvejs=e()}(self,(function(){return(self.webpackChunkjezvejs=self.webpackChunkjezvejs||[]).push([[22],{50676:function(t,e,n){"use strict";function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}n.d(e,{Z:function(){return i}})},63349:function(t,e,n){"use strict";function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}n.d(e,{Z:function(){return i}})},6610:function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}n.d(e,{Z:function(){return i}})},5991:function(t,e,n){"use strict";function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function r(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t}n.d(e,{Z:function(){return r}})},77608:function(t,e,n){"use strict";function i(t){return(i=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}n.d(e,{Z:function(){return i}})},65255:function(t,e,n){"use strict";function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function r(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}n.d(e,{Z:function(){return r}})},46070:function(t,e,n){"use strict";n.d(e,{Z:function(){return o}});var i=n(90484),r=n(63349);function o(t,e){return!e||"object"!==(0,i.Z)(e)&&"function"!=typeof e?(0,r.Z)(t):e}},87329:function(t,e,n){"use strict";n.d(e,{Z:function(){return o}});var i=n(50676),r=n(82961);function o(t){return function(t){if(Array.isArray(t))return(0,i.Z)(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||(0,r.Z)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},90484:function(t,e,n){"use strict";function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}n.d(e,{Z:function(){return i}})},82961:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var i=n(50676);function r(t,e){if(t){if("string"==typeof t)return(0,i.Z)(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?(0,i.Z)(t,e):void 0}}},97070:function(t,e,n){"use strict";n.d(e,{P:function(){return v}});var i=n(6610),r=n(5991),o=n(63349),a=n(65255),s=n(46070),c=n(77608),u=n(85772),l=n(64918),h=n(79040),f=n(93379),d=n.n(f),p=n(7695);d()(p.Z,{insert:"head",singleton:!1}),p.Z.locals;var v=function(t){(0,a.Z)(f,t);var e,n,l=(e=f,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,i=(0,c.Z)(e);if(n){var r=(0,c.Z)(this).constructor;t=Reflect.construct(i,arguments,r)}else t=i.apply(this,arguments);return(0,s.Z)(this,t)});function f(t){var e;if((0,i.Z)(this,f),!((e=l.call(this,t)).elem&&e.props&&e.props.data&&e.props.data.values&&e.props.data.series))throw new Error("Invalid chart properties");return e.chartsWrapObj=null,e.chart=null,e.chartContent=null,e.verticalLabels=null,e.container=null,e.labelsContainer=null,e.paperHeight=300,e.hLabelsHeight=25,e.vLabelsWidth=10,e.chartMarginTop=10,e.barMargin=10,e.barWidth=0,e.chartWidth=0,e.chartHeight=0,e.lastHLabelOffset=0,e.chartContentWidth=0,e.gridValuesMargin=.1,e.minGridStep=30,e.maxGridStep=60,"visibilityOffset"in(0,o.Z)(e)||(e.visibilityOffset=1),"scaleAroundAxis"in(0,o.Z)(e)||(e.scaleAroundAxis=!0),e.data={},e.items=[],e.grid=null,e.gridLines=[],e.vertLabels=[],e.fitToWidth=!1,e.autoScale=!1,e.itemClickHandler=null,e.scrollHandler=null,e.itemOverHandler=null,e.itemOutHandler=null,e.data=e.props.data,"widthFit"in e.props&&(e.fitToWidth=e.props.widthFit),"autoScale"in e.props&&(e.autoScale=e.props.autoScale),"height"in e.props&&(e.paperHeight=parseInt(e.props.height,10)),e.scrollHandler=(0,u.mf)(e.props.onscroll)?e.props.onscroll:null,e.itemClickHandler=(0,u.mf)(e.props.onitemclick)?e.props.onitemclick:null,e.itemOverHandler=(0,u.mf)(e.props.onitemover)?e.props.onitemover:null,e.itemOutHandler=(0,u.mf)(e.props.onitemout)?e.props.onitemout:null,e}return(0,r.Z)(f,[{key:"init",value:function(){this.verticalLabels=(0,u.ce)("div"),this.chart=(0,u.ce)("div"),this.chartContent=(0,u.ce)("div",{className:"chart_content"},this.chart,{scroll:this.onScroll.bind(this)}),this.chartsWrapObj=(0,u.ce)("div",{className:"charts"},[(0,u.ce)("div",{className:"chart_wrap"},this.chartContent),(0,u.ce)("div",{className:"vertical-legend"},this.verticalLabels)]),this.elem.appendChild(this.chartsWrapObj),this.chartHeight=this.paperHeight-this.hLabelsHeight-this.chartMarginTop,this.barWidth=38,this.labelsContainer=(0,u.YP)("svg",{width:this.vLabelsWidth,height:this.paperHeight+20}),this.verticalLabels.appendChild(this.labelsContainer),this.calculateGrid(this.data.values),this.fitToWidth&&(this.barWidth=this.chart.parentNode.offsetWidth/(this.data.values.length+1),this.barWidth>10?(this.barMargin=this.barWidth/5,this.barWidth-=4*this.barMargin):this.barMargin=0),this.chartContentWidth=this.data.values.length*(this.barWidth+this.barMargin),this.chartWidth=Math.max(this.chart.offsetWidth,this.chartContentWidth);var t={};((0,u.mf)(this.itemOverHandler)||(0,u.mf)(this.itemOutHandler))&&(t.mousemove=this.onItemOver.bind(this),t.mouseout=this.onItemOut.bind(this)),(0,u.mf)(this.itemClickHandler)&&(t.click=this.onItemClick.bind(this)),this.container=(0,u.YP)("svg",{width:this.chartWidth,height:this.paperHeight},null,t),this.chart.appendChild(this.container),this.containerOffset=(0,u.os)(this.container),this.drawVLabels(),this.createItems(),this.scaleVisible(),this.createHLabels(),this.updateChartWidth(),this.drawGrid()}},{key:"getContent",value:function(){return this.chartContent}},{key:"getWrapObject",value:function(){return this.chartsWrapObj}},{key:"calculateGrid",value:function(t){var e=new h.w({scaleAroundAxis:this.scaleAroundAxis,height:this.chartHeight,margin:this.chartMarginTop,minStep:this.minGridStep,maxStep:this.maxGridStep,valuesMargin:this.gridValuesMargin});e.calculate(t),this.grid=e}},{key:"removeElements",value:function(t){(Array.isArray(t)?t:[t]).forEach((function(t){t.parentNode&&t.parentNode.removeChild(t)}))}},{key:"drawGrid",value:function(){var t=this.chartWidth,e=0,n=[];if(this.grid.steps){for(var i=this.grid.yFirst;e<=this.grid.steps;){var r=Math.round(i);r>i?r-=.5:r+=.5;var o="M0,".concat(r,"L").concat(t,",").concat(r),a=(0,u.YP)("path",{class:"chart__grid-line",d:o});n.push(a),i+=this.grid.yStep,e+=1}this.removeElements(this.gridLines),(0,u.SH)(this.container,n),this.gridLines=n}}},{key:"getChartOffset",value:function(t){return t&&t.parentNode&&t.parentNode.parentNode&&t.parentNode.parentNode.parentNode?t.parentNode.parentNode.parentNode.offsetWidth:null}},{key:"mapValues",value:function(t){return t&&Array.isArray(t)?t.map((function(t){return t.value})):null}},{key:"updateChartWidth",value:function(){this.chartContentWidth=this.data.values.length*(this.barWidth+this.barMargin),this.chartContentWidth=Math.max(this.chartContentWidth,this.lastHLabelOffset);var t=this.getChartOffset(this.chart),e=Math.max(t-this.vLabelsWidth,this.chartContentWidth);this.container.setAttribute("width",e),this.container.setAttribute("height",this.paperHeight),this.chartWidth=Math.max(e,this.chartContentWidth)}},{key:"setVertLabelsWidth",value:function(t){if(this.labelsContainer&&this.chart){var e=Math.ceil(t);this.vLabelsWidth!==e&&(this.labelsContainer.setAttribute("width",e),this.labelsContainer.setAttribute("height",this.paperHeight+20),this.vLabelsWidth=e,this.updateChartWidth())}}},{key:"getVisibleItems",value:function(){var t=[],e=this.visibilityOffset,n=this.barWidth+this.barMargin,i=Math.round(this.chartContent.offsetWidth/n);i=Math.min(this.items.length,i+2*e);var r=Math.floor(this.chartContent.scrollLeft/n);(r=Math.max(0,r-e))+i>=this.items.length&&(i=this.items.length-r);for(var o=0;o<i;o+=1)t.push(this.items[r+o]);return t}},{key:"drawVLabels",value:function(){var t=this.grid.yFirst,e=this.grid.valueFirst,n=0,i=0;if(this.grid.steps){for(this.removeElements(this.vertLabels),this.vertLabels=[];n<=this.grid.steps;){var r=0===Math.abs(this.grid.toPrec(e))?0:this.grid.toPrecString(e),o=(0,u.YP)("tspan",{dy:5.5});o["innerHTML"in o?"innerHTML":"textContent"]=r.toString();var a=(0,u.YP)("text",{className:"chart__text",x:5,y:Math.round(t)},o);this.labelsContainer.appendChild(a),this.vertLabels.push(a);var s=a.getBoundingClientRect();i=Math.max(i,Math.ceil(s.width)+10),e-=this.grid.valueStep,t+=this.grid.yStep,n+=1}this.setVertLabelsWidth(i)}}},{key:"createHLabels",value:function(){var t=0,e=0,n=this.paperHeight-this.hLabelsHeight/2;this.data.series.forEach((function(i){var r=i[0],o=i[1];if(0===e||t>e+10){var a=(0,u.YP)("tspan",{dy:5.5});a["innerHTML"in a?"innerHTML":"textContent"]=r.toString();var s=(0,u.YP)("text",{className:"chart__text",x:t,y:n},a);this.container.appendChild(s);var c=s.getBoundingClientRect();e=t+Math.ceil(c.width)}t+=o*(this.barWidth+this.barMargin)}),this),this.lastHLabelOffset=e}},{key:"findItemByEvent",value:function(t){var e=t.clientX-this.containerOffset.left+this.chartContent.scrollLeft,n=Math.floor(e/(this.barWidth+this.barMargin));return n<0||n>=this.items.length?null:this.items[n]}},{key:"onItemClick",value:function(t){if((0,u.mf)(this.itemClickHandler)){var e=this.findItemByEvent(t);e&&this.itemClickHandler.call(this,t,e)}}},{key:"onItemOver",value:function(t){if((0,u.mf)(this.itemOverHandler)){var e=this.findItemByEvent(t);this.activeItem!==e&&(this.activeItem&&(0,u.mf)(this.itemOutHandler)&&this.itemOutHandler.call(this,t,this.activeItem),e&&(this.activeItem=e,this.itemOverHandler.call(this,t,e)))}}},{key:"onItemOut",value:function(t){if((0,u.mf)(this.itemOutHandler)){var e=this.activeItem;this.activeItem=null,e&&this.itemOutHandler.call(this,t,e)}}},{key:"scaleVisible",value:function(){if(this.autoScale){var t=this.getVisibleItems(),e=this.mapValues(t);this.calculateGrid(e),this.drawVLabels(),this.drawGrid(),this.updateItemsScale(t)}}},{key:"onScroll",value:function(){this.scaleVisible(),(0,u.mf)(this.scrollHandler)&&this.scrollHandler.call(this)}},{key:"createItems",value:function(){}},{key:"updateItemsScale",value:function(t){}}]),f}(l.w)},79040:function(t,e,n){"use strict";n.d(e,{w:function(){return s}});var i=n(87329),r=n(6610),o=n(5991),a=n(85772),s=function(){function t(e){var n=this;(0,r.Z)(this,t);var i={scaleAroundAxis:!0,valuesMargin:0,minStep:0,maxStep:0};this.props=(0,a.Kn)(e)?e:{},["height","margin"].forEach((function(t){if(!(t in n.props))throw new Error("Invalid properties: Expected ".concat(t))})),this.absMaxVal=this.props.height,this.margin=this.props.margin,Object.keys(i).forEach((function(t){n[t]=t in n.props?n.props[t]:i[t]})),this.precision=0,this.valueStep=1,this.valueFirst=0,this.valueLast=0,this.steps=0,this.yFirst=0,this.yLast=0}return(0,o.Z)(t,[{key:"roundToPrecision",value:function(t,e){var n=parseInt(e,10);return parseFloat(t.toFixed(n))}},{key:"getExp",value:function(t){var e=Math.abs(t),n={precision:0,exponent:1};if(e>1)for(;e>=10;)e/=10,n.exponent*=10;else if(e>0&&e<1){for(;e<1;)e*=10,n.exponent/=10,n.precision+=1;n.exponent=this.roundToPrecision(n.exponent,n.precision)}return n}},{key:"toPrec",value:function(t){return this.roundToPrecision(t,this.precision)}},{key:"toPrecString",value:function(t){return t.toFixed(this.precision)}},{key:"floor",value:function(t){var e=this.roundToPrecision(t/this.valueStep,2),n=Math.floor(e)*this.valueStep;return this.toPrec(n)}},{key:"ceil",value:function(t){var e=this.roundToPrecision(t/this.valueStep,2),n=Math.ceil(e)*this.valueStep;return this.toPrec(n)}},{key:"setValueRange",value:function(t,e){this.minValue=Math.min(t,e),this.maxValue=Math.max(t,e),this.dValue=Math.abs(e-t);var n=this.getExp(this.dValue);this.valueStep=n.exponent,this.precision=n.precision,this.firstStep=this.ceil(this.maxValue),this.lastStep=this.floor(this.minValue),this.dStep=this.getStepsHeight(),this.setViewRange(this.lastStep,this.firstStep),this.adjustSteps()}},{key:"setViewRange",value:function(t,e){this.viewMin=Math.min(t,e),this.viewMax=Math.max(t,e),this.viewDelta=Math.abs(e-t),this.firstStep=this.getFirst(),this.lastStep=this.getLast(),this.dStep=this.getStepsHeight(),this.steps=this.getSteps()}},{key:"adjustSteps",value:function(){for(;this.steps<4;)this.splitSteps();if(this.steps>5){var t=this.steps%4;t>0&&this.addSteps(4-t)}}},{key:"getFirst",value:function(){return this.floor(this.viewMax)}},{key:"getLast",value:function(){return this.ceil(this.viewMin)}},{key:"splitSteps",value:function(){this.steps*=2,this.valueStep/=2,this.valueStep<1&&(this.precision+=1)}},{key:"joinSteps",value:function(){this.steps/=2,this.valueStep*=2}},{key:"getSteps",value:function(){return Math.abs(Math.round(this.dStep/this.valueStep))}},{key:"getStepsHeight",value:function(){return Math.abs(this.firstStep-this.lastStep)}},{key:"isBoth",value:function(){return this.minValue<0&&this.maxValue>0}},{key:"isPositive",value:function(){return this.minValue>=0&&this.maxValue>0}},{key:"isNegative",value:function(){return this.minValue<0&&this.maxValue<=0}},{key:"addSteps",value:function(t){this.scaleAroundAxis&&!this.isBoth()?this.isPositive()?this.firstStep+=t*this.valueStep:this.isNegative()&&(this.lastStep-=t*this.valueStep):Math.abs(this.minValue-this.lastStep)>Math.abs(this.maxValue-this.firstStep)?(this.lastStep-=Math.floor(t/2)*this.valueStep,this.firstStep+=Math.ceil(t/2)*this.valueStep):(this.lastStep-=Math.ceil(t/2)*this.valueStep,this.firstStep+=Math.floor(t/2)*this.valueStep),this.setViewRange(this.lastStep,this.firstStep)}},{key:"scaleViewRange",value:function(t){var e=this.viewMin,n=this.viewMax;if(this.scaleAroundAxis&&!this.isBoth())this.isPositive()?n=this.viewMax*t:this.isNegative()&&(e=this.viewMin*t);else{var i=this.dValue/2+this.minValue,r=this.viewDelta*t/2;e=i-r,n=i+r}this.setViewRange(e,n)}},{key:"convertRelToAbs",value:function(t){return this.absMaxVal*((t-this.viewMin)/this.viewDelta)}},{key:"getHeight",value:function(t){var e=this.convertRelToAbs(0),n=this.convertRelToAbs(t);return Math.abs(e-n)}},{key:"getY",value:function(t){var e=this.convertRelToAbs(t);return this.absMaxVal+this.margin-e}},{key:"calculate",value:function(t){if(t.length){var e=Math.min.apply(Math,(0,i.Z)(t)),n=Math.max.apply(Math,(0,i.Z)(t));if((this.scaleAroundAxis||1===t.length)&&(e=Math.min(e,0),n=Math.max(n,0)),this.setValueRange(e,n),this.valuesMargin>0){var r=this.dValue/(1-this.valuesMargin)/this.viewDelta;this.scaleViewRange(r)}if(this.yStep=this.getHeight(this.valueStep),this.maxStep)for(;this.yStep>this.maxStep;)this.splitSteps(),this.yStep=this.getHeight(this.valueStep);if(this.minStep)for(;this.yStep<this.minStep;)this.joinSteps(),this.yStep=this.getHeight(this.valueStep);this.valueFirst=this.getFirst(),this.valueLast=this.getLast(),this.steps=Math.floor((this.valueFirst-this.viewMin)/this.valueStep),this.yFirst=this.getY(this.valueFirst),this.yLast=this.getY(this.valueLast)}}}]),t}()},55082:function(t,e,n){"use strict";n.r(e),n.d(e,{LineChart:function(){return u}});var i=n(6610),r=n(5991),o=n(65255),a=n(46070),s=n(77608),c=n(85772);var u=function(t){(0,o.Z)(l,t);var e,n,u=(e=l,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,i=(0,s.Z)(e);if(n){var r=(0,s.Z)(this).constructor;t=Reflect.construct(i,arguments,r)}else t=i.apply(this,arguments);return(0,a.Z)(this,t)});function l(t){var e;return(0,i.Z)(this,l),(e=u.call(this,t)).line=null,e.visibilityOffset=2,e.scaleAroundAxis=!1,e.init(),e}return(0,r.Z)(l,[{key:"createItems",value:function(){var t=this,e=(this.barWidth+this.barMargin)/2;this.items=this.data.values.map((function(n,i){var r={value:n,dot:{x:i*(t.barWidth+t.barMargin)+e,y:t.grid.getY(n)}};return r.elem=(0,c.YP)("circle",{cx:r.dot.x,cy:r.dot.y,r:4}),r.elem.classList.add("linechart__item"),t.container.appendChild(r.elem),r})),this.drawPath()}},{key:"drawPath",value:function(){this.line&&this.line.parentNode.removeChild(this.line);for(var t="",e=0,n=this.items.length-1;e<n;e+=1){var i=this.items[e].dot,r=this.items[e+1].dot;e||(t+="M".concat(i.x,",").concat(i.y)),t+="L".concat(r.x,",").concat(r.y)}this.line=(0,c.YP)("path",{d:t}),this.line.classList.add("linechart__path"),this.container.appendChild(this.line),this.items.length&&this.items[0].elem&&(0,c.Vt)(this.line,this.items[0].elem)}},{key:"updateItemsScale",value:function(t){var e=this;Array.isArray(t)&&(t.forEach((function(t){var n=t.dot;n.y=e.grid.getY(t.value),t.elem.setAttribute("cy",n.y)})),this.drawPath())}}],[{key:"create",value:function(t){return new l(t)}}]),l}(n(97070).P)},64918:function(t,e,n){"use strict";n.d(e,{w:function(){return a}});var i=n(6610),r=n(5991),o=n(85772),a=function(){function t(e){(0,i.Z)(this,t),this.props=void 0===e?{}:e,this.props.parent&&(this.parent=this.props.parent),"string"==typeof this.props.elem?this.elem=(0,o.ge)(this.props.elem):this.elem=this.props.elem}return(0,r.Z)(t,[{key:"parse",value:function(){}},{key:"render",value:function(){}},{key:"show",value:function(t){var e=void 0===t||!!t;this.elem&&(0,o.$Z)(this.elem,e)}},{key:"hide",value:function(){this.show(!1)}}]),t}()},85772:function(t,e,n){"use strict";n.d(e,{ge:function(){return r},J_:function(){return o},mf:function(){return a},Kn:function(){return s},Zw:function(){return c},t4:function(){return u},KT:function(){return l},jl:function(){return h},Fl:function(){return f},Os:function(){return d},ce:function(){return p},YP:function(){return v},re:function(){return m},e9:function(){return g},GN:function(){return y},QV:function(){return b},pn:function(){return S},$Z:function(){return w},wp:function(){return x},wm:function(){return k},NW:function(){return M},Bc:function(){return C},x0:function(){return E},kP:function(){return L},DJ:function(){return O},Uc:function(){return T},Vt:function(){return j},BE:function(){return A},SH:function(){return I},yd:function(){return H},DV:function(){return P},Ro:function(){return W},GE:function(){return V},q_:function(){return Z},gD:function(){return R},os:function(){return N},p5:function(){return _},oe:function(){return B},xb:function(){return F},Tc:function(){return Y},px:function(){return D},e5:function(){return X},YM:function(){return G},vs:function(){return U},L_:function(){return z},Um:function(){return J},l7:function(){return K},CU:function(){return $}});var i=n(90484),r=document.getElementById.bind(document);function o(t){return t instanceof Date&&!isNaN(t.valueOf())}function a(t){return t&&("[object Function]"==={}.toString.call(t)||"function"==typeof t)}function s(t){return"object"===(0,i.Z)(t)&&"[object Object]"===Object.prototype.toString.call(t)}function c(t){var e;return Array.isArray(t)?t.map(c):s(t)?(e={},Object.keys(t).forEach((function(n){e[n]=c(t[n])})),e):t}function u(t,e){t&&e&&"object"===(0,i.Z)(e)&&Object.keys(e).forEach((function(n){var i=e[n];if(Array.isArray(i))t[n]=i.map((function(t){return t}));else if(s(i))null!==t[n]&&void 0!==t[n]||(t[n]={}),u(t[n],i);else try{t[n]=i}catch(e){t.setAttribute&&t.setAttribute(n,i)}}))}function l(t,e){t&&s(e)&&Object.keys(e).forEach((function(n){t.setAttribute(n,e[n])}))}function h(t,e){t&&e&&(Array.isArray(e)?e:[e]).forEach((function(e){e&&t.appendChild(e)}))}function f(t,e){t&&e&&Object.keys(e).forEach((function(n){t.addEventListener(n,e[n])}))}function d(t,e){t&&e&&Object.keys(e).forEach((function(n){t.removeEventListener(n,e[n])}))}function p(t,e,n,i){if("string"!=typeof t)return null;var r=document.createElement(t);return r?(e&&u(r,e),n&&h(r,n),i&&f(r,i),r):null}function v(t,e,n,i){if("string"!=typeof t)return null;var r=document.createElementNS("http://www.w3.org/2000/svg",t);return e&&l(r,e),n&&h(r,n),i&&f(r,i),r}function m(t){var e="string"==typeof t?r(t):t;return e&&e.parentNode?e.parentNode.removeChild(e):null}function g(t){return 0===parseFloat(t)||!!(t/t)}function y(t){var e=parseInt(t,10);return!isNaN(e)&&t===e&&t.toString()===e.toString()}function b(t){return t?window.getComputedStyle?getComputedStyle(t,""):t.currentStyle:null}function S(t,e){for(var n="string"==typeof t?r(t):t;n&&n.nodeType&&9!==n.nodeType;){var i=b(n);if(!i||"none"===i.display||"hidden"===i.visibility)return!1;if(!0!==e)break;n=n.parentNode}return!!n}function w(t,e){var n="string"==typeof t?r(t):t;n&&n.classList&&(e?n.classList.remove("hidden"):n.classList.add("hidden"))}function x(t,e){var n="string"==typeof t?r(t):t;n&&(n.disabled=!e)}function k(t){if(!t)return 0;if(t.focus(),t.selectionStart)return t.selectionStart;if(document.selection){var e=document.selection.createRange(),n=e.duplicate();return e.collapse(!0),n.moveToElementText(t),n.setEndPoint("EndToEnd",e),n.text.length}return 0}function M(t){if(!t)return null;if("selectionStart"in t&&document.activeElement===t)return{start:t.selectionStart,end:t.selectionEnd};if(t.createTextRange){var e=document.selection.createRange();if(e.parentElement()===t){var n,i,r=t.createTextRange();for(r.moveToBookmark(e.getBookmark()),n=0;r.compareEndPoints("EndToStart",r)>0;r.moveEnd("character",-1))n+=1;for(r.setEndPoint("StartToStart",t.createTextRange()),i={start:0,end:n};r.compareEndPoints("EndToStart",r)>0;r.moveEnd("character",-1))i.start+=1,i.end+=1;return i}}return null}function C(t,e){if(t)if(t.createTextRange){var n=t.createTextRange();n.collapse(!0),n.moveEnd("character",e),n.moveStart("character",e),n.select()}else t.setSelectionRange&&t.setSelectionRange(e,e)}function E(t){if("string"!=typeof t||!t.length)return!1;var e=t.split(".");return 3===e.length&&!!(g(e[0])&&g(e[1])&&g(e[2]))&&!(e[0]<1||e[0]>31||e[1]<1||e[1]>12||e[2]<1970)}function L(t){if(!t||!t.options||-1===t.selectedIndex)return-1;var e=t.options[t.selectedIndex];return e.textContent?e.textContent:e.innerText}function O(t){return t&&t.options&&-1!==t.selectedIndex?t.options[t.selectedIndex].value:-1}function T(t,e,n){if(!t||!t.options||void 0===e)return!1;for(var i=e.toString(),r=0,o=t.options.length;r<o;r+=1){var a=t.options[r];if(a&&a.value===i)return t.multiple?a.selected=void 0===n||n:t.selectedIndex=r,!0}return!1}function j(t,e){return e&&e.parentNode?e.parentNode.insertBefore(t,e):null}function A(t,e){var n=e.parentNode,i=e.nextSibling;return i?n.insertBefore(t,i):n.appendChild(t)}function I(t,e){if(e&&t){var n=Array.isArray(e)?e:[e],i=t.firstChild;i?n.reduce((function(t,e){return j(e,t),e}),i):n.forEach((function(e){return t.appendChild(e)}))}}function H(t){if(t)for(;t.childNodes.length>0;)t.removeChild(t.childNodes[0])}function P(t,e){if((t=t||window.event).currentTarget||(t.currentTarget=e),t.target||(t.target=t.srcElement),t.relatedTarget||("mouseover"===t.type&&(t.relatedTarget=t.fromElement),"mouseout"===t.type&&(t.relatedTarget=t.toElement)),null===t.pageX&&null!==t.clientX){var n=document.documentElement,i=document.body;t.pageX=t.clientX+(n.scrollLeft||i&&i.scrollLeft||0),t.pageX-=n.clientLeft||0,t.pageY=t.clientY+(n.scrollTop||i&&i.scrollTop||0),t.pageY-=n.clientTop||0}return!t.which&&t.button&&(1&t.button?t.which=1:2&t.button?t.which=3:t.which=4&t.button?2:0),t}function W(t,e,n){var i=!0,o=Array.isArray(n)?n:[n];a(e)&&(t&&(i=o.every((function(e){var n=("string"==typeof e?r(e):e)||null;return n&&!n.contains(t.target)&&n!==t.target||!n}))),i&&e())}function V(t,e){var n=null,i=t||null;document.documentElement&&(a(i)&&(n=function(t){W(t,i,e)}),document.documentElement.onclick=null,setTimeout((function(){document.documentElement.onclick=n})))}function Z(t){for(var e=t,n=0,i=0;e;)n+=parseInt(e.offsetTop,10),i+=parseInt(e.offsetLeft,10),e=e.offsetParent;return{top:n,left:i}}function R(t){var e=t.getBoundingClientRect(),n=document.body,i=document.documentElement,r=window.pageYOffset||i.scrollTop||n.scrollTop,o=window.pageXOffset||i.scrollLeft||n.scrollLeft,a=i.clientTop||n.clientTop||0,s=i.clientLeft||n.clientLeft||0,c=e.top+r-a,u=e.left+o-s;return{top:Math.round(c),left:Math.round(u)}}function N(t){return t.getBoundingClientRect?R(t):Z(t)}function _(t,e){return t.compareDocumentPosition?t.compareDocumentPosition(e):(t!==e&&t.contains(e)&&16)+(t!==e&&e.contains(t)&&8)+(t.sourceIndex>=0&&e.sourceIndex>=0?(t.sourceIndex<e.sourceIndex&&4)+(t.sourceIndex>e.sourceIndex&&2):1)}function B(){if(void 0!==window.pageXOffset)return{left:pageXOffset,top:pageYOffset};var t=document.documentElement,e=document.body,n=t.scrollTop||e&&e.scrollTop||0;n-=t.clientTop;var i=t.scrollLeft||e&&e.scrollLeft||0;return{top:n,left:i-=t.clientLeft}}function F(t){return"object"!==(0,i.Z)(t)||0===Object.keys(t).length}function Y(t){return"object"===(0,i.Z)(t)?Object.keys(t).length:0}function D(t){return"".concat(parseInt(t,10),"px")}function X(t){var e=[];return s(t)?(Object.keys(t).forEach((function(n){var i=t[n];if(Array.isArray(i))i.forEach((function(t){if(!s(t)){var i=encodeURIComponent(n),r=encodeURIComponent(t.toString());e.push("".concat(i,"[]=").concat(r))}}));else if(!s(i)){var r=encodeURIComponent(n),o=encodeURIComponent(i.toString());e.push("".concat(r,"=").concat(o))}})),e.join("&")):""}function G(){if(document){if(document.head)return document.head;if(document.documentElement&&document.documentElement.firstChild)return document.documentElement.firstChild}return null}function U(t,e){t&&t.style&&(void 0!==t.style.webkitTransform?t.style.webkitTransform=e:void 0!==t.style.MozTransform?t.style.MozTransform=e:void 0!==t.style.msTransform?t.style.msTransform=e:void 0!==t.style.transform&&(t.style.transform=e))}function z(){return window.devicePixelRatio?window.devicePixelRatio:screen.deviceXDPI&&screen.logicalXDPI?screen.deviceXDPI/screen.logicalXDPI:screen.availWidth/document.documentElement.clientWidth}function J(t){J.readyList.length||function(t){var e=!1;function n(){e||(e=!0,function(){for(var t=0;t<J.readyList.length;t+=1)J.readyList[t]()}())}document.addEventListener?document.addEventListener("DOMContentLoaded",(function(){n()}),!1):document.attachEvent&&(document.documentElement.doScroll&&window===window.top&&function t(){if(!e&&document.body)try{document.documentElement.doScroll("left"),n()}catch(e){setTimeout(t,0)}}(),document.attachEvent("onreadystatechange",(function(){"complete"===document.readyState&&n()}))),window.addEventListener?window.addEventListener("load",n,!1):window.attachEvent&&window.attachEvent("onload",n)}(),J.readyList.push(t)}function K(t,e){function n(){}n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.parent=e.prototype}function $(t){t.prototype=Object.create(Error.prototype,{constructor:{value:Error,enumerable:!1,writable:!0,configurable:!0}}),Object.setPrototypeOf?Object.setPrototypeOf(t,Error):t.__proto__=Error}J.readyList=[]},7695:function(t,e,n){"use strict";var i=n(23645),r=n.n(i)()((function(t){return t[1]}));r.push([t.id,'/* Main container for charts */\n.charts {\n  display: flex;\n  flex-flow: row nowrap;\n  flex-basis: 100%;\n}\n\n.charts svg {\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  -webkit-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  overflow: hidden;\n}\n\n.chart_wrap {\n  flex-basis: 100%;\n  overflow: hidden;\n}\n\n.chart_content {\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  overflow: auto;\n}\n\n/* Bar chart information popup */\n.chart_popup {\n  position: absolute;\n  border: 1px solid #000000;\n  background-color: #ffffff;\n  padding: 5px;\n  white-space: nowrap;\n}\n\n/* Chart grid line */\n.chart__grid-line {\n  stroke-width: 1;\n  fill: none;\n  stroke: #808080;\n  stroke-dasharray: 4, 3;\n}\n\n/* Chart text */\n.chart__text {\n  font-family: "Segoe UI", sans-serif;\n  font-size: 14px;\n  text-anchor: "start";\n}\n\n/* Histogram bar item */\n.histogram__bar {\n  fill: #00bfff;\n  fill-opacity: 1;\n  stroke: none;\n}\n\n/* LineChart circle item */\n.linechart__item {\n  fill: #ffffff;\n  stroke: #00bfff;\n  stroke-width: 1.5;\n}\n\n/* LineChart line path */\n.linechart__path {\n  stroke-width: 3;\n  stroke: #00bfff;\n  fill: none;\n}\n',""]),e.Z=r},23645:function(t){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=t(e);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,i){"string"==typeof t&&(t=[[null,t,""]]);var r={};if(i)for(var o=0;o<this.length;o++){var a=this[o][0];null!=a&&(r[a]=!0)}for(var s=0;s<t.length;s++){var c=[].concat(t[s]);i&&r[c[0]]||(n&&(c[2]?c[2]="".concat(n," and ").concat(c[2]):c[2]=n),e.push(c))}},e}},93379:function(t,e,n){"use strict";var i,r=function(){var t={};return function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}t[e]=n}return t[e]}}(),o=[];function a(t){for(var e=-1,n=0;n<o.length;n++)if(o[n].identifier===t){e=n;break}return e}function s(t,e){for(var n={},i=[],r=0;r<t.length;r++){var s=t[r],c=e.base?s[0]+e.base:s[0],u=n[c]||0,l="".concat(c," ").concat(u);n[c]=u+1;var h=a(l),f={css:s[1],media:s[2],sourceMap:s[3]};-1!==h?(o[h].references++,o[h].updater(f)):o.push({identifier:l,updater:v(f,e),references:1}),i.push(l)}return i}function c(t){var e=document.createElement("style"),i=t.attributes||{};if(void 0===i.nonce){var o=n.nc;o&&(i.nonce=o)}if(Object.keys(i).forEach((function(t){e.setAttribute(t,i[t])})),"function"==typeof t.insert)t.insert(e);else{var a=r(t.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(e)}return e}var u,l=(u=[],function(t,e){return u[t]=e,u.filter(Boolean).join("\n")});function h(t,e,n,i){var r=n?"":i.media?"@media ".concat(i.media," {").concat(i.css,"}"):i.css;if(t.styleSheet)t.styleSheet.cssText=l(e,r);else{var o=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(o,a[e]):t.appendChild(o)}}function f(t,e,n){var i=n.css,r=n.media,o=n.sourceMap;if(r?t.setAttribute("media",r):t.removeAttribute("media"),o&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}var d=null,p=0;function v(t,e){var n,i,r;if(e.singleton){var o=p++;n=d||(d=c(e)),i=h.bind(null,n,o,!1),r=h.bind(null,n,o,!0)}else n=c(e),i=f.bind(null,n,e),r=function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(n)};return i(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;i(t=e)}else r()}}t.exports=function(t,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=(void 0===i&&(i=Boolean(window&&document&&document.all&&!window.atob)),i));var n=s(t=t||[],e);return function(t){if(t=t||[],"[object Array]"===Object.prototype.toString.call(t)){for(var i=0;i<n.length;i++){var r=a(n[i]);o[r].references--}for(var c=s(t,e),u=0;u<n.length;u++){var l=a(n[u]);0===o[l].references&&(o[l].updater(),o.splice(l,1))}n=c}}}}},function(t){"use strict";return 55082,t(t.s=55082)}])}));