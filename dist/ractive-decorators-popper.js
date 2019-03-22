(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("popper.js"));
	else if(typeof define === 'function' && define.amd)
		define(["popper.js"], factory);
	else if(typeof exports === 'object')
		exports["RactiveDecoratorsPopper"] = factory(require("popper.js"));
	else
		root["RactiveDecoratorsPopper"] = factory(root["Popper"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var popper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var popper_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(popper_js__WEBPACK_IMPORTED_MODULE_0__);


function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    clearTimeout(timeout);
    if (immediate && !timeout) func.apply(context, args);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
  };
}

function popper_decorator(el, options) {
  var r = this;
  var trigger = el.querySelector('[popper-trigger]');
  var pop = el.querySelector('[popper]');
  var defaults = {
    click_to_close: true,
    enable_arrows: true,
    popover: false
  };
  options = Object.assign(defaults, options); // If it's a bootstrap popover we have to take care of the popover class to be inline with the poppers placement

  if (options.popover === true) {
    var placement = undefined;

    options.onCreate = function (data) {
      data.instance.popper.classList.remove('bs-popover-' + data.originalPlacement.split('-')[0]);
      data.instance.popper.classList.add('bs-popover-' + data.placement.split('-')[0]);
    };

    options.onUpdate = function (data) {
      if (!placement) {
        placement = data.placement;
      }

      if (placement != data.placement) {
        // console.log('placement changed');
        data.instance.popper.classList.remove('bs-popover-' + placement.split('-')[0]);
        data.instance.popper.classList.add('bs-popover-' + data.placement.split('-')[0]);
        placement = data.placement;
      }
    };
  }

  var self = pop.decorator = {
    popper: null,
    init: function init() {
      trigger.addEventListener('click', self.toggle);
    },
    destroy: function destroy() {
      trigger.removeEventListener('click', self.toggle);
      self.close();
    },
    click: function click(e) {
      // console.log('Firing document click');
      if (options.click_to_close === true) {
        if (trigger.contains(e.target)) {// console.log('closing will be handled by toggle');
        } else {
          self.close();
        }
      } else {
        if (trigger.contains(e.target) || pop.contains(e.target)) {// console.log('do nothing, closing will be handled by toggle');
        } else {
          self.close();
        }
      }
    },
    keydown: function keydown(e) {
      // Up (38) and down (40) arrow keys (works only in <li><a href=""></a></li> structures)
      // Note: IE does not focus on disabled elements
      // console.log('Firing document keydown');
      if (options.enable_arrows && (e.keyCode == 40 || e.keyCode == 38)) {
        e.preventDefault();

        if (document.activeElement == trigger || document.activeElement == pop) {
          var a = pop.querySelector('a.dropdown-item');

          if (a) {
            a.focus();
          }

          return;
        }

        if (pop.contains(document.activeElement) && document.activeElement.tagName.toLowerCase() === 'a' && document.activeElement.classList.contains('dropdown-item')) {
          var is_list = false; // Item might be an a or an li element depending on the dropdown structure

          var item = document.activeElement;

          if (document.activeElement.parentElement.tagName.toLowerCase() === 'li') {
            item = document.activeElement.parentElement;
            is_list = true;
          }

          var next_or_prev = 'nextElementSibling';

          if (e.keyCode == 38) {
            next_or_prev = 'previousElementSibling';
          } // Get the next or prev sibling element


          item = item[next_or_prev]; // As long as a sibling exists

          while (item) {
            if (item.offsetHeight == 0) {
              item = item[next_or_prev];
              continue;
            } // If we've reached our match, bail
            // In case item is an li


            if (is_list) {
              if (item.querySelector('a')) {
                break;
              } // In case item is an a

            } else {
              if (item && item.classList.contains('dropdown-divider') === false && item.classList.contains('dropdown-header') == false) {
                break;
              }

              if (item && item[next_or_prev].classList.contains('dropdown-header')) {
                item = item[next_or_prev];
              }
            } // Get the next or prev sibling


            item = item[next_or_prev];
          }

          if (item) {
            if (is_list) {
              item.querySelector('a').focus();
            } else {
              item.focus();
            }
          }
        }
      }

      if (e.keyCode == 27) {
        document.removeEventListener('keydown', self.keydown);
        self.close();
      }
    },
    resize: debounce(function () {
      // console.log('Firing window resize');
      if (pop.classList.contains('dropdown-menu-rwd') && !window.matchMedia('(max-width: 991px)').matches) {
        window.removeEventListener('resize', self.resize);
        self.close();
      }
    }, 350),
    open: function open() {
      var ctx = r.getContext(pop);
      ctx.raise('popper_before_open');
      el.classList.add('show');
      pop.classList.add('show');

      if (!self.popper) {
        self.popper = new popper_js__WEBPACK_IMPORTED_MODULE_0___default.a(trigger, pop, options);
      }

      document.addEventListener('click', self.click);
      document.addEventListener('keydown', self.keydown);
      window.addEventListener('resize', self.resize);
      ctx.raise('popper_open');
    },
    close: function close() {
      var ctx = r.getContext(pop);
      ctx.raise('popper_before_close');
      el.classList.remove('show');
      pop.classList.remove('show');

      if (self.popper) {
        self.popper.destroy();
      }

      self.popper = null;
      document.removeEventListener('click', self.click);
      document.removeEventListener('keydown', self.keydown);
      window.removeEventListener('resize', self.resize);
      ctx.raise('popper_close');
    },
    toggle: function toggle(e) {
      e.preventDefault();

      if (el.classList.contains('show')) {
        self.close();
      } else {
        self.open();
      }
    }
  };
  pop.decorator.init();
  return {
    teardown: function teardown() {
      pop.decorator.destroy();
    }
  };
}

/* harmony default export */ __webpack_exports__["default"] = (popper_decorator);

/***/ })
/******/ ])["default"];
});