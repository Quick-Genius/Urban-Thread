import{r as O}from"./react-vendor-DW_61ag2.js";var x={exports:{}},a={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R;function j(){if(R)return a;R=1;var o=O(),p=Symbol.for("react.element"),d=Symbol.for("react.fragment"),S=Object.prototype.hasOwnProperty,l=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,m={key:!0,ref:!0,__self:!0,__source:!0};function c(s,t,f){var n,e={},r=null,u=null;f!==void 0&&(r=""+f),t.key!==void 0&&(r=""+t.key),t.ref!==void 0&&(u=t.ref);for(n in t)S.call(t,n)&&!m.hasOwnProperty(n)&&(e[n]=t[n]);if(s&&s.defaultProps)for(n in t=s.defaultProps,t)e[n]===void 0&&(e[n]=t[n]);return{$$typeof:p,type:s,key:r,ref:u,props:e,_owner:l.current}}return a.Fragment=d,a.jsx=c,a.jsxs=c,a}var h;function b(){return h||(h=1,x.exports=j()),x.exports}var L=b(),y={exports:{}},E={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var q;function k(){if(q)return E;q=1;var o=O();function p(e,r){return e===r&&(e!==0||1/e===1/r)||e!==e&&r!==r}var d=typeof Object.is=="function"?Object.is:p,S=o.useState,l=o.useEffect,m=o.useLayoutEffect,c=o.useDebugValue;function s(e,r){var u=r(),v=S({inst:{value:u,getSnapshot:r}}),i=v[0].inst,_=v[1];return m(function(){i.value=u,i.getSnapshot=r,t(i)&&_({inst:i})},[e,u,r]),l(function(){return t(i)&&_({inst:i}),e(function(){t(i)&&_({inst:i})})},[e]),c(u),u}function t(e){var r=e.getSnapshot;e=e.value;try{var u=r();return!d(e,u)}catch{return!0}}function f(e,r){return r()}var n=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?f:s;return E.useSyncExternalStore=o.useSyncExternalStore!==void 0?o.useSyncExternalStore:n,E}var w;function I(){return w||(w=1,y.exports=k()),y.exports}I();export{L as j};
