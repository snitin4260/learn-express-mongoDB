parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"ZX4Z":[function(require,module,exports) {
"use strict";var e=1;function t(){return(e=(9301*e+49297)%233280)/233280}function n(t){e=t}module.exports={nextValue:t,seed:n};
},{}],"BhiS":[function(require,module,exports) {
"use strict";var e,t,r,n=require("./random/random-from-seed"),u="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";function o(){r=!1}function i(t){if(t){if(t!==e){if(t.length!==u.length)throw new Error("Custom alphabet for shortid must be "+u.length+" unique characters. You submitted "+t.length+" characters: "+t);var r=t.split("").filter(function(e,t,r){return t!==r.lastIndexOf(e)});if(r.length)throw new Error("Custom alphabet for shortid must be "+u.length+" unique characters. These characters were not unique: "+r.join(", "));e=t,o()}}else e!==u&&(e=u,o())}function s(t){return i(t),e}function a(e){n.seed(e),t!==e&&(o(),t=e)}function h(){e||i(u);for(var t,r=e.split(""),o=[],s=n.nextValue();r.length>0;)s=n.nextValue(),t=Math.floor(s*r.length),o.push(r.splice(t,1)[0]);return o.join("")}function f(){return r||(r=h())}function l(e){return f()[e]}function c(){return e||u}module.exports={get:c,characters:s,seed:a,lookup:l,shuffled:f};
},{"./random/random-from-seed":"ZX4Z"}],"6l1L":[function(require,module,exports) {
"use strict";var o,t="object"==typeof window&&(window.crypto||window.msCrypto);o=t&&t.getRandomValues?function(o){return t.getRandomValues(new Uint8Array(o))}:function(o){for(var t=[],r=0;r<o;r++)t.push(Math.floor(256*Math.random()));return t},module.exports=o;
},{}],"pjkr":[function(require,module,exports) {
module.exports=function(t,r,e){for(var a=(2<<Math.log(r.length-1)/Math.LN2)-1,h=Math.ceil(1.6*a*e/r.length),l="";;)for(var n=t(h),o=0;o<h;o++){var f=n[o]&a;if(r[f]&&(l+=r[f]).length===e)return l}};
},{}],"9ZVM":[function(require,module,exports) {
"use strict";var r=require("./alphabet"),e=require("./random/random-byte"),t=require("nanoid/format");function a(a){for(var o,n=0,u="";!o;)u+=t(e,r.get(),1),o=a<Math.pow(16,n+1),n++;return u}module.exports=a;
},{"./alphabet":"BhiS","./random/random-byte":"6l1L","nanoid/format":"pjkr"}],"HW8S":[function(require,module,exports) {
"use strict";var e,r,t=require("./generate"),a=require("./alphabet"),o=1459707606518,u=6;function n(a){var n="",i=Math.floor(.001*(Date.now()-o));return i===r?e++:(e=0,r=i),n+=t(u),n+=t(a),e>0&&(n+=t(e)),n+=t(i)}module.exports=n;
},{"./generate":"9ZVM","./alphabet":"BhiS"}],"DKYU":[function(require,module,exports) {
"use strict";var e=require("./alphabet");function t(t){return!(!t||"string"!=typeof t||t.length<6)&&!new RegExp("[^"+e.get().replace(/[|\\{}()[\]^$+*?.-]/g,"\\$&")+"]").test(t)}module.exports=t;
},{"./alphabet":"BhiS"}],"AzWI":[function(require,module,exports) {
"use strict";module.exports=0;
},{}],"XQNt":[function(require,module,exports) {
"use strict";var e=require("./alphabet"),r=require("./build"),u=require("./is-valid"),t=require("./util/cluster-worker-id")||0;function o(r){return e.seed(r),module.exports}function s(e){return t=e,module.exports}function i(r){return void 0!==r&&e.characters(r),e.shuffled()}function d(){return r(t)}module.exports=d,module.exports.generate=d,module.exports.seed=o,module.exports.worker=s,module.exports.characters=i,module.exports.isValid=u;
},{"./alphabet":"BhiS","./build":"HW8S","./is-valid":"DKYU","./util/cluster-worker-id":"AzWI"}],"JEO+":[function(require,module,exports) {
"use strict";module.exports=require("./lib/index");
},{"./lib/index":"XQNt"}],"Focm":[function(require,module,exports) {
var e,t,a=require("shortid"),r=document.querySelector(".additem-input"),i=document.querySelector(".list-container"),s=document.querySelector(".filter"),n=document.querySelector(".overlay"),c="",l=0,o=function(e){return document.createElement(e)},d=function(e,t){return Object.keys(t).forEach(function(a){e.setAttribute(a,t[a])}),e},u=function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var r=t.shift();t.forEach(function(e){r.appendChild(e)})},v=function(e){var t=e.currentTarget,a=t.parentNode,r=t.nextElementSibling,i=t.querySelector(".list__tick");"true"===t.dataset.checked?(t.dataset.checked="false",g(a.id,"checked","false"),"Completed"===c&&h(null,"Completed",!0)):(t.dataset.checked="true",g(a.id,"checked","true"),"Active"===c&&h(null,"Active",!0)),r.classList.toggle("taskdone"),i.classList.toggle("hide")},h=function(t,a){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],s=a||t.target.textContent;if(a||t.target.classList.contains("filter__item")){c=s;var n=Array.from(i.children);switch(r||(e&&e.classList.remove("tabstyle"),t.target.classList.add("tabstyle"),e=t.target),s){case"All":for(var l=0,o=n;l<o.length;l++){var d=o[l];d.classList.contains("hide")&&d.classList.remove("hide")}break;case"Active":for(var u=0,v=n;u<v.length;u++){var h=v[u];"true"===h.querySelector(".list__checkbox").dataset.checked?h.classList.add("hide"):h.classList.remove("hide")}break;case"Completed":for(var f=0,g=n;f<g.length;f++){var m=g[f];"false"===m.querySelector(".list__checkbox").dataset.checked?m.classList.add("hide"):m.classList.remove("hide")}}}},f=function(e,t){var a=o("div");a.innerHTML="&#10003","true"===t?a.setAttribute("class","list__tick"):a.setAttribute("class","list__tick hide"),e.appendChild(a)},g=function(e,t,a){var r=JSON.parse(localStorage.getItem("tasks")),i=!0,s=!1,n=void 0;try{for(var c,l=r[Symbol.iterator]();!(i=(c=l.next()).done);i=!0){var o=c.value;o.id===e&&(o[t]=a)}}catch(d){s=!0,n=d}finally{try{i||null==l.return||l.return()}finally{if(s)throw n}}localStorage.setItem("tasks",JSON.stringify(r))},m=function(e){if(localStorage.getItem("tasks")){var t=JSON.parse(localStorage.getItem("tasks"));t.push(e),localStorage.setItem("tasks",JSON.stringify(t))}else localStorage.setItem("tasks",JSON.stringify([e]))},_=function(e){var t=JSON.parse(localStorage.getItem("tasks")).filter(function(t){return t.id!==e});localStorage.setItem("tasks",JSON.stringify(t))},k=function(e,t,a,r){var i=a.querySelector(".list__checkbox"),s=a.querySelector(".list__deleteButton"),n=a.querySelector(".list__task"),c=a.querySelector(".note");n.innerText=e.value,1===r&&(n.innerText=t),g(a.id,"text",n.innerText),n.classList.toggle("hide"),s.classList.toggle("hide"),i.classList.toggle("hide"),c.classList.toggle("hide"),a.removeChild(e)},L=function(e,t,a){var r=0;if(!e.target.closest(".list__edit")){""===a.value.trim()&&(r=1);var i=a.parentNode;i&&k(a,t,i,r)}},y=function(e,t){var a=0;if("Enter"===e.key){var r=e.target;""===r.value.trim()&&(a=1);var i=r.parentNode;k(r,t,i,a)}},S=function(e){if("P"===e.target.tagName){var t=e.target.parentNode,a=e.target,r=t.querySelector(".list__checkbox"),i=t.querySelector(".list__deleteButton"),s=t.querySelector(".note");a.classList.toggle("hide"),i.classList.toggle("hide"),r.classList.toggle("hide"),s.classList.toggle("hide");var n=o("input");d(n,{class:"list__edit",value:a.innerText,type:"text"}),t.appendChild(n),n.focus();var c=n.value;n.value="",n.value=c,n.addEventListener("keydown",function(e){return y(e,c)}),document.addEventListener("click",function(e){return L(e,c,n)})}},p=function(e){var t=e.target.parentNode,a=e.target,r=t.querySelector(".modal__saveButton"),i=t.querySelector(".modal__textarea"),s=t.querySelector(".modal__text");i.classList.remove("hide"),i.focus(),i.value="",i.value=s.textContent,r.classList.remove("hide"),s.classList.add("hide"),a.classList.add("hide")},x=function(e){var t=e.target.parentNode,a=t.parentNode.parentNode,r=e.target,i=t.querySelector(".modal__editButton"),s=t.querySelector(".modal__textarea"),n=t.querySelector(".modal__text");""!==s.value.trim()&&(n.textContent=s.value,g(a.id,"note",n.textContent),s.classList.add("hide"),r.classList.add("hide"),n.classList.remove("hide"),i.classList.remove("hide"))},b=function(e){var a=e.target;if(e.target.classList.contains("note")){var r=a.querySelector(".modal");t=r.id,r.classList.remove("hide");var i=r.querySelector(".modal__textarea");i.classList.contains("hide")||i.focus(),n.classList.remove("hide")}},q=function(e,t){var a="",r="",i="",s="";""===t?(i="hide",s="hide"):(a="hide",r="hide");var n=o("textarea");n.setAttribute("class","modal__textarea ".concat(a));var c=o("button");c.setAttribute("class","modal__button modal__saveButton ".concat(r)),c.textContent="SAVE",c.addEventListener("click",x);var l=o("button");l.setAttribute("class","modal__button modal__editButton ".concat(s)),l.textContent="EDIT",l.addEventListener("click",p);var d=o("p");""!==t&&(d.textContent=t),d.setAttribute("class","modal__text ".concat(i)),u(e,n,d,c,l)},E=function(e){var t=o("div");return t.setAttribute("class","modal hide"),t.setAttribute("id",a.generate()),q(t,e),t},C=function(e){var t=o("div");t.setAttribute("class","note"),t.innerText="+",t.addEventListener("click",b);var a=E(e);return t.appendChild(a),t},A=function(e){var t=o("div");return t.dataset.checked=e.checked,d(t,{class:"list__checkbox"}),f(t,e.checked),t.addEventListener("click",v),t},N=function(e){var t=o("p");t.innerText=e.text;var a="list__task";return"true"===e.checked&&(a+=" taskdone"),d(t,{class:a}),t},I=function(e){var t=o("div");return t.innerHTML="&#9747",d(t,{class:"list__deleteButton"}),t.addEventListener("click",function(){_(e.id),i.removeChild(e),0===--l&&s.classList.add("hide")}),t},T=function(e){var t=o("li");d(t,{class:"list",id:e.id});var a=A(e),r=N(e),i=I(t),s=C(e.note);return t.addEventListener("dblclick",S),u(t,a,r,s,i),t},O=function(e){if("Enter"===e.key){var t=r.value;if(""!==t.trim()){r.value="";var n={text:t,checked:"false",id:a.generate(),note:""};m(n);var o=T(n);l++,i.appendChild(o),s.classList.contains("hide")&&s.classList.remove("hide"),"Completed"===c&&h(null,"Completed",!0)}}},B=function(e){var a=document.getElementById(t),r=e.target;a.classList.add("hide"),r.classList.add("hide")},J=function(){localStorage.getItem("tasks")&&JSON.parse(localStorage.getItem("tasks")).forEach(function(e){return T(e)})};J(),n.addEventListener("click",B),s.addEventListener("click",h),r.addEventListener("keydown",O);
},{"shortid":"JEO+"}]},{},["Focm"], null)
//# sourceMappingURL=/todo.100658da.js.map