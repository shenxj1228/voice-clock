!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){"use strict";b.exports=a("./lib/component.selectfx")},{"./lib/component.selectfx":2}],2:[function(a,b){"use strict";var c=a("classie"),d=a("util-extend"),e=a("events"),f=a("util"),g=function(a,b){if(!a)return!1;for(var c=a.target||a.srcElement||a||!1;c&&c!=b;)c=c.parentNode||!1;return c!==!1},h=function(a,b){e.EventEmitter.call(this),this.el=a,this.options=d({},this.options),this.options=d(this.options,b),this._init()};f.inherits(h,e.EventEmitter),h.prototype.options={newTab:!0,stickyPlaceholder:!0,onChange:function(){return!1}},h.prototype._init=function(){var a=this.el.querySelector("option[selected]");this.hasDefaultPlaceholder=a&&a.disabled,this.selectedOpt=a||this.el.querySelector("option"),this._createSelectEl(),this.selOpts=[].slice.call(this.selEl.querySelectorAll("li[data-option]")),this.selOptsCount=this.selOpts.length,this.current=this.selOpts.indexOf(this.selEl.querySelector("li.cs-selected"))||-1,this.selPlaceholder=this.selEl.querySelector("span.cs-placeholder"),this._initEvents()},h.prototype._createSelectEl=function(){var a="",b=function(a){var b="",c="",d="";return!a.selectedOpt||this.foundSelected||this.hasDefaultPlaceholder||(c+="cs-selected ",this.foundSelected=!0),a.getAttribute("data-class")&&(c+=a.getAttribute("data-class")),a.getAttribute("data-link")&&(d="data-link="+a.getAttribute("data-link")),""!==c&&(b='class="'+c+'" '),"<li "+b+d+' data-option data-value="'+a.value+'"><span>'+a.textContent+"</span></li>"};[].slice.call(this.el.children).forEach(function(c){if(!c.disabled){var d=c.tagName.toLowerCase();"option"===d?a+=b(c):"optgroup"===d&&(a+='<li class="cs-optgroup"><span>'+c.label+"</span><ul>",[].slice.call(c.children).forEach(function(c){a+=b(c)}),a+="</ul></li>")}});var c='<div class="cs-options"><ul>'+a+"</ul></div>";this.selEl=document.createElement("div"),this.selEl.className=this.el.className,this.selEl.tabIndex=this.el.tabIndex,this.selEl.innerHTML='<span class="cs-placeholder">'+this.selectedOpt.textContent+"</span>"+c,this.el.parentNode.appendChild(this.selEl),this.selEl.appendChild(this.el)},h.prototype._initEvents=function(){var a=this;this.selPlaceholder.addEventListener("click",function(){a._toggleSelect()}),this.selOpts.forEach(function(b,c){b.addEventListener("click",function(){a.current=c,a._changeOption(),a._toggleSelect()})}),document.addEventListener("click",function(b){var c=b.target;a._isOpen()&&c!==a.selEl&&!g(c,a.selEl)&&a._toggleSelect()}),this.selEl.addEventListener("keydown",function(b){var c=b.keyCode||b.which;switch(c){case 38:b.preventDefault(),a._navigateOpts("prev");break;case 40:b.preventDefault(),a._navigateOpts("next");break;case 32:b.preventDefault(),a._isOpen()&&"undefined"!=typeof a.preSelCurrent&&-1!==a.preSelCurrent&&a._changeOption(),a._toggleSelect();break;case 13:b.preventDefault(),a._isOpen()&&"undefined"!=typeof a.preSelCurrent&&-1!==a.preSelCurrent&&(a._changeOption(),a._toggleSelect());break;case 27:b.preventDefault(),a._isOpen()&&a._toggleSelect()}})},h.prototype._navigateOpts=function(a){this._isOpen()||this._toggleSelect();var b="undefined"!=typeof this.preSelCurrent&&-1!==this.preSelCurrent?this.preSelCurrent:this.current;("prev"===a&&b>0||"next"===a&&b<this.selOptsCount-1)&&(this.preSelCurrent="next"===a?b+1:b-1,this._removeFocus(),c.add(this.selOpts[this.preSelCurrent],"cs-focus"))},h.prototype._toggleSelect=function(){this._removeFocus(),this._isOpen()?(-1!==this.current&&(this.selPlaceholder.textContent=this.selOpts[this.current].textContent),c.remove(this.selEl,"cs-active")):(this.hasDefaultPlaceholder&&this.options.stickyPlaceholder&&(this.selPlaceholder.textContent=this.selectedOpt.textContent),c.add(this.selEl,"cs-active"))},h.prototype._changeOption=function(){"undefined"!=typeof this.preSelCurrent&&-1!==this.preSelCurrent&&(this.current=this.preSelCurrent,this.preSelCurrent=-1);var a=this.selOpts[this.current];this.selPlaceholder.textContent=a.textContent,this.el.value=a.getAttribute("data-value");var b=this.selEl.querySelector("li.cs-selected");b&&c.remove(b,"cs-selected"),c.add(a,"cs-selected"),a.getAttribute("data-link")&&(this.options.newTab?window.open(a.getAttribute("data-link"),"_blank"):window.location=a.getAttribute("data-link")),this.options.onChange(this.el.value)},h.prototype._isOpen=function(){return c.has(this.selEl,"cs-active")},h.prototype._removeFocus=function(){var a=this.selEl.querySelector("li.cs-focus");a&&c.remove(a,"cs-focus")},b.exports=h},{classie:3,events:5,util:9,"util-extend":10}],3:[function(a,b){b.exports=a("./lib/classie")},{"./lib/classie":4}],4:[function(a,b){"use strict";function c(a){return new RegExp("(^|\\s+)"+a+"(\\s+|$)")}function d(a,b){var c=e(a,b)?g:f;c(a,b)}var e,f,g;"object"==typeof document&&"classList"in document.documentElement?(e=function(a,b){return a.classList.contains(b)},f=function(a,b){a.classList.add(b)},g=function(a,b){a.classList.remove(b)}):(e=function(a,b){return c(b).test(a.className)},f=function(a,b){e(a,b)||(a.className=a.className+" "+b)},g=function(a,b){a.className=a.className.replace(c(b)," ")});var h={hasClass:e,addClass:f,removeClass:g,toggleClass:d,has:e,add:f,remove:g,toggle:d};"object"==typeof b&&b&&"object"==typeof b.exports?b.exports=h:define(h),"object"==typeof window&&"object"==typeof window.document&&(window.classie=h)},{}],5:[function(a,b){function c(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function d(a){return"function"==typeof a}function e(a){return"number"==typeof a}function f(a){return"object"==typeof a&&null!==a}function g(a){return void 0===a}b.exports=c,c.EventEmitter=c,c.prototype._events=void 0,c.prototype._maxListeners=void 0,c.defaultMaxListeners=10,c.prototype.setMaxListeners=function(a){if(!e(a)||0>a||isNaN(a))throw TypeError("n must be a positive number");return this._maxListeners=a,this},c.prototype.emit=function(a){var b,c,e,h,i,j;if(this._events||(this._events={}),"error"===a&&(!this._events.error||f(this._events.error)&&!this._events.error.length)){if(b=arguments[1],b instanceof Error)throw b;throw TypeError('Uncaught, unspecified "error" event.')}if(c=this._events[a],g(c))return!1;if(d(c))switch(arguments.length){case 1:c.call(this);break;case 2:c.call(this,arguments[1]);break;case 3:c.call(this,arguments[1],arguments[2]);break;default:for(e=arguments.length,h=new Array(e-1),i=1;e>i;i++)h[i-1]=arguments[i];c.apply(this,h)}else if(f(c)){for(e=arguments.length,h=new Array(e-1),i=1;e>i;i++)h[i-1]=arguments[i];for(j=c.slice(),e=j.length,i=0;e>i;i++)j[i].apply(this,h)}return!0},c.prototype.addListener=function(a,b){var e;if(!d(b))throw TypeError("listener must be a function");if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",a,d(b.listener)?b.listener:b),this._events[a]?f(this._events[a])?this._events[a].push(b):this._events[a]=[this._events[a],b]:this._events[a]=b,f(this._events[a])&&!this._events[a].warned){var e;e=g(this._maxListeners)?c.defaultMaxListeners:this._maxListeners,e&&e>0&&this._events[a].length>e&&(this._events[a].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[a].length),"function"==typeof console.trace&&console.trace())}return this},c.prototype.on=c.prototype.addListener,c.prototype.once=function(a,b){function c(){this.removeListener(a,c),e||(e=!0,b.apply(this,arguments))}if(!d(b))throw TypeError("listener must be a function");var e=!1;return c.listener=b,this.on(a,c),this},c.prototype.removeListener=function(a,b){var c,e,g,h;if(!d(b))throw TypeError("listener must be a function");if(!this._events||!this._events[a])return this;if(c=this._events[a],g=c.length,e=-1,c===b||d(c.listener)&&c.listener===b)delete this._events[a],this._events.removeListener&&this.emit("removeListener",a,b);else if(f(c)){for(h=g;h-->0;)if(c[h]===b||c[h].listener&&c[h].listener===b){e=h;break}if(0>e)return this;1===c.length?(c.length=0,delete this._events[a]):c.splice(e,1),this._events.removeListener&&this.emit("removeListener",a,b)}return this},c.prototype.removeAllListeners=function(a){var b,c;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[a]&&delete this._events[a],this;if(0===arguments.length){for(b in this._events)"removeListener"!==b&&this.removeAllListeners(b);return this.removeAllListeners("removeListener"),this._events={},this}if(c=this._events[a],d(c))this.removeListener(a,c);else for(;c.length;)this.removeListener(a,c[c.length-1]);return delete this._events[a],this},c.prototype.listeners=function(a){var b;return b=this._events&&this._events[a]?d(this._events[a])?[this._events[a]]:this._events[a].slice():[]},c.listenerCount=function(a,b){var c;return c=a._events&&a._events[b]?d(a._events[b])?1:a._events[b].length:0}},{}],6:[function(a,b){b.exports="function"==typeof Object.create?function(a,b){a.super_=b,a.prototype=Object.create(b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}})}:function(a,b){a.super_=b;var c=function(){};c.prototype=b.prototype,a.prototype=new c,a.prototype.constructor=a}},{}],7:[function(a,b){function c(){}var d=b.exports={};d.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),d.title="browser",d.browser=!0,d.env={},d.argv=[],d.on=c,d.addListener=c,d.once=c,d.off=c,d.removeListener=c,d.removeAllListeners=c,d.emit=c,d.binding=function(){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(){throw new Error("process.chdir is not supported")}},{}],8:[function(a,b){b.exports=function(a){return a&&"object"==typeof a&&"function"==typeof a.copy&&"function"==typeof a.fill&&"function"==typeof a.readUInt8}},{}],9:[function(a,b,c){(function(b,d){function e(a,b){var d={seen:[],stylize:g};return arguments.length>=3&&(d.depth=arguments[2]),arguments.length>=4&&(d.colors=arguments[3]),p(b)?d.showHidden=b:b&&c._extend(d,b),v(d.showHidden)&&(d.showHidden=!1),v(d.depth)&&(d.depth=2),v(d.colors)&&(d.colors=!1),v(d.customInspect)&&(d.customInspect=!0),d.colors&&(d.stylize=f),i(d,a,d.depth)}function f(a,b){var c=e.styles[b];return c?"["+e.colors[c][0]+"m"+a+"["+e.colors[c][1]+"m":a}function g(a){return a}function h(a){var b={};return a.forEach(function(a){b[a]=!0}),b}function i(a,b,d){if(a.customInspect&&b&&A(b.inspect)&&b.inspect!==c.inspect&&(!b.constructor||b.constructor.prototype!==b)){var e=b.inspect(d,a);return t(e)||(e=i(a,e,d)),e}var f=j(a,b);if(f)return f;var g=Object.keys(b),p=h(g);if(a.showHidden&&(g=Object.getOwnPropertyNames(b)),z(b)&&(g.indexOf("message")>=0||g.indexOf("description")>=0))return k(b);if(0===g.length){if(A(b)){var q=b.name?": "+b.name:"";return a.stylize("[Function"+q+"]","special")}if(w(b))return a.stylize(RegExp.prototype.toString.call(b),"regexp");if(y(b))return a.stylize(Date.prototype.toString.call(b),"date");if(z(b))return k(b)}var r="",s=!1,u=["{","}"];if(o(b)&&(s=!0,u=["[","]"]),A(b)){var v=b.name?": "+b.name:"";r=" [Function"+v+"]"}if(w(b)&&(r=" "+RegExp.prototype.toString.call(b)),y(b)&&(r=" "+Date.prototype.toUTCString.call(b)),z(b)&&(r=" "+k(b)),0===g.length&&(!s||0==b.length))return u[0]+r+u[1];if(0>d)return w(b)?a.stylize(RegExp.prototype.toString.call(b),"regexp"):a.stylize("[Object]","special");a.seen.push(b);var x;return x=s?l(a,b,d,p,g):g.map(function(c){return m(a,b,d,p,c,s)}),a.seen.pop(),n(x,r,u)}function j(a,b){if(v(b))return a.stylize("undefined","undefined");if(t(b)){var c="'"+JSON.stringify(b).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return a.stylize(c,"string")}return s(b)?a.stylize(""+b,"number"):p(b)?a.stylize(""+b,"boolean"):q(b)?a.stylize("null","null"):void 0}function k(a){return"["+Error.prototype.toString.call(a)+"]"}function l(a,b,c,d,e){for(var f=[],g=0,h=b.length;h>g;++g)f.push(F(b,String(g))?m(a,b,c,d,String(g),!0):"");return e.forEach(function(e){e.match(/^\d+$/)||f.push(m(a,b,c,d,e,!0))}),f}function m(a,b,c,d,e,f){var g,h,j;if(j=Object.getOwnPropertyDescriptor(b,e)||{value:b[e]},j.get?h=j.set?a.stylize("[Getter/Setter]","special"):a.stylize("[Getter]","special"):j.set&&(h=a.stylize("[Setter]","special")),F(d,e)||(g="["+e+"]"),h||(a.seen.indexOf(j.value)<0?(h=q(c)?i(a,j.value,null):i(a,j.value,c-1),h.indexOf("\n")>-1&&(h=f?h.split("\n").map(function(a){return"  "+a}).join("\n").substr(2):"\n"+h.split("\n").map(function(a){return"   "+a}).join("\n"))):h=a.stylize("[Circular]","special")),v(g)){if(f&&e.match(/^\d+$/))return h;g=JSON.stringify(""+e),g.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(g=g.substr(1,g.length-2),g=a.stylize(g,"name")):(g=g.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),g=a.stylize(g,"string"))}return g+": "+h}function n(a,b,c){var d=0,e=a.reduce(function(a,b){return d++,b.indexOf("\n")>=0&&d++,a+b.replace(/\u001b\[\d\d?m/g,"").length+1},0);return e>60?c[0]+(""===b?"":b+"\n ")+" "+a.join(",\n  ")+" "+c[1]:c[0]+b+" "+a.join(", ")+" "+c[1]}function o(a){return Array.isArray(a)}function p(a){return"boolean"==typeof a}function q(a){return null===a}function r(a){return null==a}function s(a){return"number"==typeof a}function t(a){return"string"==typeof a}function u(a){return"symbol"==typeof a}function v(a){return void 0===a}function w(a){return x(a)&&"[object RegExp]"===C(a)}function x(a){return"object"==typeof a&&null!==a}function y(a){return x(a)&&"[object Date]"===C(a)}function z(a){return x(a)&&("[object Error]"===C(a)||a instanceof Error)}function A(a){return"function"==typeof a}function B(a){return null===a||"boolean"==typeof a||"number"==typeof a||"string"==typeof a||"symbol"==typeof a||"undefined"==typeof a}function C(a){return Object.prototype.toString.call(a)}function D(a){return 10>a?"0"+a.toString(10):a.toString(10)}function E(){var a=new Date,b=[D(a.getHours()),D(a.getMinutes()),D(a.getSeconds())].join(":");return[a.getDate(),J[a.getMonth()],b].join(" ")}function F(a,b){return Object.prototype.hasOwnProperty.call(a,b)}var G=/%[sdj%]/g;c.format=function(a){if(!t(a)){for(var b=[],c=0;c<arguments.length;c++)b.push(e(arguments[c]));return b.join(" ")}for(var c=1,d=arguments,f=d.length,g=String(a).replace(G,function(a){if("%%"===a)return"%";if(c>=f)return a;switch(a){case"%s":return String(d[c++]);case"%d":return Number(d[c++]);case"%j":try{return JSON.stringify(d[c++])}catch(b){return"[Circular]"}default:return a}}),h=d[c];f>c;h=d[++c])g+=q(h)||!x(h)?" "+h:" "+e(h);return g},c.deprecate=function(a,e){function f(){if(!g){if(b.throwDeprecation)throw new Error(e);b.traceDeprecation?console.trace(e):console.error(e),g=!0}return a.apply(this,arguments)}if(v(d.process))return function(){return c.deprecate(a,e).apply(this,arguments)};if(b.noDeprecation===!0)return a;var g=!1;return f};var H,I={};c.debuglog=function(a){if(v(H)&&(H=b.env.NODE_DEBUG||""),a=a.toUpperCase(),!I[a])if(new RegExp("\\b"+a+"\\b","i").test(H)){var d=b.pid;I[a]=function(){var b=c.format.apply(c,arguments);console.error("%s %d: %s",a,d,b)}}else I[a]=function(){};return I[a]},c.inspect=e,e.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},e.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},c.isArray=o,c.isBoolean=p,c.isNull=q,c.isNullOrUndefined=r,c.isNumber=s,c.isString=t,c.isSymbol=u,c.isUndefined=v,c.isRegExp=w,c.isObject=x,c.isDate=y,c.isError=z,c.isFunction=A,c.isPrimitive=B,c.isBuffer=a("./support/isBuffer");var J=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];c.log=function(){console.log("%s - %s",E(),c.format.apply(c,arguments))},c.inherits=a("inherits"),c._extend=function(a,b){if(!b||!x(b))return a;for(var c=Object.keys(b),d=c.length;d--;)a[c[d]]=b[c[d]];return a}}).call(this,a("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":8,_process:7,inherits:6}],10:[function(a,b){function c(a,b){if(!b||"object"!=typeof b)return a;for(var c=Object.keys(b),d=c.length;d--;)a[c[d]]=b[c[d]];return a}b.exports=c},{}],11:[function(a){"use strict";var b=a("../../index");window.SelectFX=b},{"../../index":1}]},{},[11]);
//# sourceMappingURL=example.min.js.map