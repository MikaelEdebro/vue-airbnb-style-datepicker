'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Datepicker = { render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "datepicker" }, [_vm._v(" this is my datepicker ")]);
  }, staticRenderFns: []

};

var DatepickerPlugin = {
  install: function install(Vue) {
    Vue.component('datepicker', Datepicker);
  }
};
// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(DatepickerPlugin);
  window.Datepicker = DatepickerPlugin;
}

exports.Datepicker = Datepicker;
