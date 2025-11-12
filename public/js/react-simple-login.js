/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/react/simple-login.jsx":
/*!*********************************************!*\
  !*** ./resources/js/react/simple-login.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   mount: () => (/* binding */ mount)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\nfunction _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = \"function\" == typeof Symbol ? Symbol : {}, n = r.iterator || \"@@iterator\", o = r.toStringTag || \"@@toStringTag\"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, \"_invoke\", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError(\"Generator is already running\"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = \"next\"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError(\"iterator result is not an object\"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i[\"return\"]) && t.call(i), c < 2 && (u = TypeError(\"The iterator does not provide a '\" + o + \"' method\"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, \"GeneratorFunction\")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, \"constructor\", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, \"constructor\", GeneratorFunction), GeneratorFunction.displayName = \"GeneratorFunction\", _regeneratorDefine2(GeneratorFunctionPrototype, o, \"GeneratorFunction\"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, \"Generator\"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, \"toString\", function () { return \"[object Generator]\"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }\nfunction _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, \"\", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o(\"next\", 0), o(\"throw\", 1), o(\"return\", 2)); }, _regeneratorDefine2(e, r, n, t); }\nfunction asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }\nfunction _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, \"next\", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, \"throw\", n); } _next(void 0); }); }; }\nfunction _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(r) { if (Array.isArray(r)) return r; }\n\n\nfunction getCsrfToken() {\n  var meta = document.querySelector('meta[name=\"csrf-token\"]');\n  return meta ? meta.getAttribute('content') : '';\n}\nfunction LoginForm() {\n  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),\n    _useState2 = _slicedToArray(_useState, 2),\n    username = _useState2[0],\n    setUsername = _useState2[1];\n  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),\n    _useState4 = _slicedToArray(_useState3, 2),\n    password = _useState4[0],\n    setPassword = _useState4[1];\n  var _useState5 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),\n    _useState6 = _slicedToArray(_useState5, 2),\n    remember = _useState6[0],\n    setRemember = _useState6[1];\n  var _useState7 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),\n    _useState8 = _slicedToArray(_useState7, 2),\n    submitting = _useState8[0],\n    setSubmitting = _useState8[1];\n  var _useState9 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''),\n    _useState0 = _slicedToArray(_useState9, 2),\n    error = _useState0[0],\n    setError = _useState0[1];\n  function handleSubmit(_x) {\n    return _handleSubmit.apply(this, arguments);\n  }\n  function _handleSubmit() {\n    _handleSubmit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event) {\n      var response, _t;\n      return _regenerator().w(function (_context) {\n        while (1) switch (_context.p = _context.n) {\n          case 0:\n            event.preventDefault();\n            setError('');\n            setSubmitting(true);\n            _context.p = 1;\n            _context.n = 2;\n            return fetch('/login', {\n              method: 'POST',\n              headers: {\n                'Content-Type': 'application/json',\n                'X-CSRF-TOKEN': getCsrfToken()\n              },\n              credentials: 'same-origin',\n              body: JSON.stringify({\n                username: username,\n                password: password,\n                remember: remember\n              })\n            });\n          case 2:\n            response = _context.v;\n            if (!response.redirected) {\n              _context.n = 3;\n              break;\n            }\n            window.location.href = response.url;\n            return _context.a(2);\n          case 3:\n            if (!response.ok) {\n              _context.n = 4;\n              break;\n            }\n            window.location.href = '/dashboard';\n            return _context.a(2);\n          case 4:\n            _context.n = 5;\n            return response.text();\n          case 5:\n            setError('Invalid credentials or server error.');\n            _context.n = 7;\n            break;\n          case 6:\n            _context.p = 6;\n            _t = _context.v;\n            setError('Network error. Please try again.');\n          case 7:\n            _context.p = 7;\n            setSubmitting(false);\n            return _context.f(7);\n          case 8:\n            return _context.a(2);\n        }\n      }, _callee, null, [[1, 6, 7, 8]]);\n    }));\n    return _handleSubmit.apply(this, arguments);\n  }\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      maxWidth: '450px',\n      width: '100%',\n      margin: '0 auto'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      textAlign: 'center',\n      marginBottom: '40px'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      width: '120px',\n      height: '120px',\n      background: 'rgba(255, 255, 255, 0.95)',\n      borderRadius: '50%',\n      margin: '0 auto 24px',\n      padding: '20px',\n      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',\n      display: 'flex',\n      alignItems: 'center',\n      justifyContent: 'center',\n      border: '3px solid rgba(255,255,255,0.3)'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"img\", {\n    src: \"/Father_Saturnino_Urios_University_logo.png\",\n    alt: \"FSUU Logo\",\n    style: {\n      width: '100%',\n      height: '100%',\n      objectFit: 'contain'\n    }\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"h2\", {\n    style: {\n      color: 'white',\n      fontWeight: 'bold',\n      fontSize: '28px',\n      marginBottom: '8px',\n      textShadow: '0 2px 10px rgba(0,0,0,0.2)'\n    }\n  }, \"Student & Faculty\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"p\", {\n    style: {\n      color: 'rgba(255,255,255,0.95)',\n      fontSize: '16px',\n      margin: 0\n    }\n  }, \"Management System\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      background: 'rgba(255, 255, 255, 0.98)',\n      borderRadius: '24px',\n      padding: '40px',\n      boxShadow: '0 30px 90px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.5)',\n      backdropFilter: 'blur(20px)',\n      border: '1px solid rgba(255,255,255,0.4)'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"h3\", {\n    style: {\n      fontSize: '24px',\n      fontWeight: 'bold',\n      marginBottom: '24px',\n      color: '#333',\n      textAlign: 'center'\n    }\n  }, \"Welcome Back\"), error ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      padding: '12px 16px',\n      background: '#fee',\n      border: '1px solid #fcc',\n      borderRadius: '12px',\n      color: '#c33',\n      marginBottom: '20px',\n      fontSize: '14px'\n    }\n  }, error) : null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"form\", {\n    onSubmit: handleSubmit\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      marginBottom: '20px'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"label\", {\n    style: {\n      display: 'block',\n      marginBottom: '8px',\n      color: '#555',\n      fontWeight: '500',\n      fontSize: '14px'\n    }\n  }, \"Username\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      position: 'relative'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"i\", {\n    className: \"fas fa-user\",\n    style: {\n      position: 'absolute',\n      left: '16px',\n      top: '50%',\n      transform: 'translateY(-50%)',\n      color: '#999',\n      fontSize: '16px'\n    }\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"input\", {\n    id: \"username\",\n    type: \"text\",\n    value: username,\n    onChange: function onChange(e) {\n      return setUsername(e.target.value);\n    },\n    placeholder: \"Enter your username\",\n    autoFocus: true,\n    required: true,\n    style: {\n      width: '100%',\n      padding: '14px 16px 14px 44px',\n      border: '2px solid #e8e8e8',\n      borderRadius: '12px',\n      fontSize: '15px',\n      transition: 'all 0.3s',\n      outline: 'none',\n      boxSizing: 'border-box',\n      backgroundColor: '#ffffff'\n    },\n    onFocus: function onFocus(e) {\n      e.target.style.borderColor = '#667eea';\n      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';\n    },\n    onBlur: function onBlur(e) {\n      e.target.style.borderColor = '#e8e8e8';\n      e.target.style.boxShadow = 'none';\n    }\n  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      marginBottom: '20px'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"label\", {\n    style: {\n      display: 'block',\n      marginBottom: '8px',\n      color: '#555',\n      fontWeight: '500',\n      fontSize: '14px'\n    }\n  }, \"Password\"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      position: 'relative'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"i\", {\n    className: \"fas fa-lock\",\n    style: {\n      position: 'absolute',\n      left: '16px',\n      top: '50%',\n      transform: 'translateY(-50%)',\n      color: '#999',\n      fontSize: '16px'\n    }\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"input\", {\n    id: \"password\",\n    type: \"password\",\n    value: password,\n    onChange: function onChange(e) {\n      return setPassword(e.target.value);\n    },\n    placeholder: \"Enter your password\",\n    required: true,\n    style: {\n      width: '100%',\n      padding: '14px 16px 14px 44px',\n      border: '2px solid #e8e8e8',\n      borderRadius: '12px',\n      fontSize: '15px',\n      transition: 'all 0.3s',\n      outline: 'none',\n      boxSizing: 'border-box',\n      backgroundColor: '#ffffff'\n    },\n    onFocus: function onFocus(e) {\n      e.target.style.borderColor = '#667eea';\n      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';\n    },\n    onBlur: function onBlur(e) {\n      e.target.style.borderColor = '#e8e8e8';\n      e.target.style.boxShadow = 'none';\n    }\n  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      display: 'flex',\n      alignItems: 'center',\n      marginBottom: '24px'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"input\", {\n    type: \"checkbox\",\n    id: \"remember\",\n    checked: remember,\n    onChange: function onChange(e) {\n      return setRemember(e.target.checked);\n    },\n    style: {\n      marginRight: '8px',\n      width: '16px',\n      height: '16px',\n      cursor: 'pointer'\n    }\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"label\", {\n    htmlFor: \"remember\",\n    style: {\n      color: '#666',\n      fontSize: '14px',\n      cursor: 'pointer',\n      userSelect: 'none'\n    }\n  }, \"Remember me\")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"button\", {\n    type: \"submit\",\n    disabled: submitting,\n    style: {\n      width: '100%',\n      padding: '14px',\n      background: submitting ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',\n      border: 'none',\n      borderRadius: '12px',\n      color: 'white',\n      fontSize: '16px',\n      fontWeight: 'bold',\n      cursor: submitting ? 'not-allowed' : 'pointer',\n      transition: 'all 0.3s',\n      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'\n    },\n    onMouseEnter: function onMouseEnter(e) {\n      return !submitting && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)');\n    },\n    onMouseLeave: function onMouseLeave(e) {\n      return !submitting && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)');\n    }\n  }, submitting ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"i\", {\n    className: \"fas fa-spinner fa-spin\",\n    style: {\n      marginRight: '8px'\n    }\n  }), \"Logging in...\") : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, \"Login\"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"div\", {\n    style: {\n      textAlign: 'center',\n      marginTop: '20px'\n    }\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"a\", {\n    href: \"#\",\n    style: {\n      color: '#667eea',\n      fontSize: '14px',\n      textDecoration: 'none'\n    }\n  }, \"Forgot Username/Password?\"))));\n}\nfunction mount() {\n  var targetId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'react-login-root';\n  var container = document.getElementById(targetId);\n  if (!container) return;\n  react_dom__WEBPACK_IMPORTED_MODULE_1___default().render(/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(LoginForm, null), container);\n}\nif (typeof window !== 'undefined') {\n  window.SimpleLogin = window.SimpleLogin || {};\n  window.SimpleLogin.mount = mount;\n}\n\n//# sourceURL=webpack:///./resources/js/react/simple-login.jsx?\n}");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./resources/js/react/simple-login.jsx");
/******/ 	var __webpack_export_target__ = window;
/******/ 	for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;