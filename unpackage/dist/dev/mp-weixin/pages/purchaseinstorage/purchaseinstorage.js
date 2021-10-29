(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/purchaseinstorage/purchaseinstorage"],{

/***/ 101:
/*!********************************************************************************************************!*\
  !*** D:/所有公司工作资料/金蝶/开发项目/KDPDA/KDPDA/main.js?{"page":"pages%2Fpurchaseinstorage%2Fpurchaseinstorage"} ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(createPage) {__webpack_require__(/*! uni-pages */ 5);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _purchaseinstorage = _interopRequireDefault(__webpack_require__(/*! ./pages/purchaseinstorage/purchaseinstorage.vue */ 102));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
createPage(_purchaseinstorage.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["createPage"]))

/***/ }),

/***/ 102:
/*!*************************************************************************************!*\
  !*** D:/所有公司工作资料/金蝶/开发项目/KDPDA/KDPDA/pages/purchaseinstorage/purchaseinstorage.vue ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./purchaseinstorage.vue?vue&type=template&id=b54efc9c& */ 103);
/* harmony import */ var _purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./purchaseinstorage.vue?vue&type=script&lang=js& */ 105);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _purchaseinstorage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./purchaseinstorage.vue?vue&type=style&index=0&lang=css& */ 107);
/* harmony import */ var _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 11);

var renderjs





/* normalize component */

var component = Object(_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/purchaseinstorage/purchaseinstorage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 103:
/*!********************************************************************************************************************!*\
  !*** D:/所有公司工作资料/金蝶/开发项目/KDPDA/KDPDA/pages/purchaseinstorage/purchaseinstorage.vue?vue&type=template&id=b54efc9c& ***!
  \********************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./purchaseinstorage.vue?vue&type=template&id=b54efc9c& */ 104);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_template_id_b54efc9c___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 104:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/所有公司工作资料/金蝶/开发项目/KDPDA/KDPDA/pages/purchaseinstorage/purchaseinstorage.vue?vue&type=template&id=b54efc9c& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    uniSearchBar: function() {
      return __webpack_require__.e(/*! import() | components/uni-search-bar/uni-search-bar */ "components/uni-search-bar/uni-search-bar").then(__webpack_require__.bind(null, /*! @/components/uni-search-bar/uni-search-bar.vue */ 241))
    },
    billstatus: function() {
      return __webpack_require__.e(/*! import() | components/billstatus/billstatus */ "components/billstatus/billstatus").then(__webpack_require__.bind(null, /*! @/components/billstatus/billstatus.vue */ 248))
    },
    uniList: function() {
      return __webpack_require__.e(/*! import() | components/uni-list/uni-list */ "components/uni-list/uni-list").then(__webpack_require__.bind(null, /*! @/components/uni-list/uni-list.vue */ 227))
    },
    uniListItem: function() {
      return __webpack_require__.e(/*! import() | components/uni-list-item/uni-list-item */ "components/uni-list-item/uni-list-item").then(__webpack_require__.bind(null, /*! @/components/uni-list-item/uni-list-item.vue */ 234))
    }
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var l0 = _vm.__map(_vm.POInstockGroupData, function(item, index) {
    var $orig = _vm.__get_orig(item)

    var g0 = (item.FSumQty / item.FInPackPreQty).toFixed(2)
    var g1 = (item.FScannedQty / item.FInPackPreQty).toFixed(2)
    var g2 = Math.round((item.FScannedQty / item.FSumQty) * 100, 0)
    return {
      $orig: $orig,
      g0: g0,
      g1: g1,
      g2: g2
    }
  })

  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        l0: l0
      }
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 105:
/*!**************************************************************************************************************!*\
  !*** D:/所有公司工作资料/金蝶/开发项目/KDPDA/KDPDA/pages/purchaseinstorage/purchaseinstorage.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./purchaseinstorage.vue?vue&type=script&lang=js& */ 106);
/* harmony import */ var _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_12_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 106:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--12-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/所有公司工作资料/金蝶/开发项目/KDPDA/KDPDA/pages/purchaseinstorage/purchaseinstorage.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var Config = function Config() {__webpack_require__.e(/*! require.ensure | common/config */ "common/vendor").then((function () {return resolve(__webpack_require__(/*! ../../common/config.js */ 26));}).bind(null, __webpack_require__)).catch(__webpack_require__.oe);};var _default =





















































































































{
  components: {
    Config: Config },

  data: function data() {
    return {
      StorageInterId: 0,
      StorageInBillNo: '空',
      StorageInSrcInterId: 0,
      StorageInSrcBillNo: '空',
      SelectedPOInstock: '0',
      SelectSupplierArray: [0, '请选择供应商'],
      SelectWareHouseArray: [0, '请选择收料仓库'],
      SearchValue: '',
      SelectedPOInstockModel: null,
      SelectGroupModel: null,
      SelectStatus: '未入库',
      StatusArray: ['未入库', '已入库'],
      TabSelectedIndex: 0,
      TouchStartX: 0,
      InStorageDate: Config.DateFormat({
        format: true }),

      StartDate: Config.DateFormat('start'),
      EndDate: Config.DateFormat('end'),
      POInstockListData: [],
      POInstockGroupData: [],
      IsBillHeadVisible: true,
      IsAddStorageIn: true,
      IsAuditStorageIn: true,
      StorageBinIsActive: true,
      Main: '',
      Receiver: '' };

  },
  onNavigationBarButtonTap: function onNavigationBarButtonTap() {
    this.SwitchBillHeadVisible();
  },
  onLoad: function onLoad() {
    this.AddListener();
    this.GetGblSetting();
    this.ShowPOInstockInfo('');
  },
  onUnload: function onUnload() {
    this.RemoveListener();
  },
  onShow: function onShow() {
    if (this.IsAddStorageIn) {
      this.ShowPOInStockGroupInfoByAdd();
    } else {
      this.ShowPOInStockGroupInfoByQuery();
    }
  },
  methods: {
    //添加广播监听
    AddListener: function AddListener() {
      var me = this;
      var main = plus.android.runtimeMainActivity(); //获取activity    
      var context = plus.android.importClass('android.content.Context'); //上下文    
      var receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
        onReceive: doReceive });

      var IntentFilter = plus.android.importClass('android.content.IntentFilter');
      var Intent = plus.android.importClass('android.content.Intent');
      var filter = new IntentFilter();

      //针对优博讯安卓PDA-i6300添加监听，其它优博讯的型号应该一样或类似
      filter.addAction("android.intent.ACTION_DECODE_DATA"); //监听扫描 		
      main.registerReceiver(receiver, filter); //注册监听 	

      //记录窗体和接收者用于关闭窗体的同时也关闭监听	
      me.Main = main;
      me.Receiver = receiver;

      function doReceive(context, intent) {
        plus.android.importClass(intent);
        var Barcode = intent.getStringExtra("barcode_string");
        if (me.TabSelectedIndex == 0) {
          me.ShowPOInstockInfo(Barcode);
        } else if (me.TabSelectedIndex == 1) {
          me.ScanBarCode(Barcode);
        }
      }
    },
    //移除广播监听
    RemoveListener: function RemoveListener() {
      this.Main.unregisterReceiver(this.Receiver); //取消监听
    },
    //获取手指滑动页面的起点
    TouchStart: function TouchStart(e) {
      this.TouchStartX = e.changedTouches[0].clientX;
    },
    //获取手指滑动页面的终点
    TouchEnd: function TouchEnd(e) {
      var TouchEndX = e.changedTouches[0].clientX;
      if (this.TouchStartX - TouchEndX >= this.SlidingValue && this.TabSelectedIndex < 2) {
        this.SlidingPage(true);
      }
      if (TouchEndX - this.TouchStartX >= this.SlidingValue && this.TabSelectedIndex > 0) {
        this.SlidingPage(false);
      }
    },
    //切换页签
    SwitchTab: function SwitchTab(TabSelectedIndex) {
      if (this.TabSelectedIndex != TabSelectedIndex) {
        this.TabSelectedIndex = TabSelectedIndex;
      }
    },
    //切换审核标志
    SwitchAuditFlag: function SwitchAuditFlag(IsAuditStorageIn) {
      this.IsAuditStorageIn = IsAuditStorageIn;
    },
    //滑动页面
    SlidingPage: function SlidingPage(IsSlidingLeftPage) {
      if (IsSlidingLeftPage) {
        this.TabSelectedIndex++;
      } else {
        this.TabSelectedIndex--;
      }

      if (this.TabSelectedIndex == 0) {} else if (this.TabSelectedIndex == 1) {

      } else {}
    },
    //切换表头是否可见
    SwitchBillHeadVisible: function SwitchBillHeadVisible() {
      this.IsBillHeadVisible = !this.IsBillHeadVisible;
    },
    //清除单据头数据
    ClearBillHeadData: function ClearBillHeadData(me) {
      me.StorageInterId = 0;
      me.StorageInBillNo = '空';
      me.StorageInSrcInterId = 0;
      me.StorageInSrcBillNo = '空';
      me.SelectSupplierArray = [0, '请选择供应商'];
      me.SelectWareHouseArray = [0, '请选择收料仓库'];
      me.InStorageDate = Config.DateFormat({
        format: true });

      me.GroupListData = [];
      me.SelectGroupModel = null;
    },
    RefreshListByChecked: function RefreshListByChecked(item) {
      for (var i = 0; i < this.POInstockListData.length; i++) {
        var DataModel = this.POInstockListData[i];
        DataModel.FIsChecked = DataModel.FBillNo == item.FBillNo ? true : false;
      }
    },
    //获取系统参数
    GetGblSetting: function GetGblSetting() {
      // uni.request({
      // 	url: uni.getStorageSync('OtherUrl'),
      // 	method: 'POST',
      // 	data: {
      // 		ModuleCode: 'getStorageBinIsActive',
      // 		token: uni.getStorageSync('token'),
      // 		ModuleParam: {
      // 			FSignalKey: 'StorageBinIsActive'
      // 		}
      // 	},
      // 	success: (result) => {
      // 		let ResultCode = result.data.ResultCode;
      // 		let ResultMsg = result.data.ResultMsg;
      // 		if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
      // 			Config.ShowMessage('账号登录异常，请重新登录！');
      // 			Config.PopAudioContext(false);
      // 			return;
      // 		}
      // 		this.StorageBinIsActive = result.data.ResultData.getStorageBinIsActiveInfo.data0
      // 			.FValue;
      // 	},
      // 	fail: () => {
      // 		Config.ShowMessage('请求数据失败！');
      // 		Config.PopAudioContext(false);
      // 	},
      // 	complete: (resultcomp) => {
      // 		let ResultMsg = resultcomp.data.ResultMsg;
      // 		if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
      // 			Config.PopAudioContext(false);
      // 			Config.ShowMessage(ResultMsg);
      // 		}
      // 	}
      // });
    },
    //显示收料通知单信息
    ShowPOInstockInfo: function ShowPOInstockInfo(Barcode) {var _this = this;
      if (this.SelectStatus == '未入库') {
        uni.showLoading({
          title: 'Loading',
          mask: true });

        uni.request({
          url: uni.getStorageSync('OtherUrl'),
          method: 'POST',
          data: {
            ModuleCode: 'GetPdaPOInstockNoPutInList',
            token: uni.getStorageSync('token'),
            ModuleParam: {
              FScanBillNo: Barcode,
              FSearchBillNo: this.SearchValue } },


          success: function success(result) {
            //console.log(result.data);
            var ResultCode = result.data.ResultCode;
            var ResultMsg = result.data.ResultMsg;
            if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
              Config.ShowMessage('账号登录异常，请重新登录！');
              Config.PopAudioContext(false);
              uni.hideLoading();
              return;
            }
            _this.POInstockListData = result.data.ResultData.GetPdaPOInstockNoPutInList.
            data0;
          },
          fail: function fail() {
            Config.ShowMessage('请求数据失败！');
            Config.PopAudioContext(false);
          },
          complete: function complete(resultcomp) {
            var ResultMsg = resultcomp.data.ResultMsg;
            if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
              Config.PopAudioContext(false);
              Config.ShowMessage(ResultMsg);
            }
            uni.hideLoading();
          } });

      } else
      {
        uni.showLoading({
          title: 'Loading',
          mask: true });

        uni.request({
          url: uni.getStorageSync('OtherUrl'),
          method: 'POST',
          data: {
            ModuleCode: 'getPdaPOInstockPutInList',
            token: uni.getStorageSync('token'),
            ModuleParam: {
              FScanBillNo: Barcode,
              FSearchBillNo: this.SearchValue } },


          success: function success(result) {
            //console.log(result.data);
            var ResultCode = result.data.ResultCode;
            var ResultMsg = result.data.ResultMsg;
            if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
              Config.ShowMessage('账号登录异常，请重新登录！');
              Config.PopAudioContext(false);
              uni.hideLoading();
              return;
            }
            _this.POInstockListData = result.data.ResultData.GetPdaPOInstockPutInList.data0;
          },
          fail: function fail() {
            Config.ShowMessage('请求数据失败！');
            Config.PopAudioContext(false);
          },
          complete: function complete(resultcomp) {
            var ResultMsg = resultcomp.data.ResultMsg;
            if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
              Config.PopAudioContext(false);
              Config.ShowMessage(ResultMsg);
            }
            uni.hideLoading();
          } });

      }
      this.IsAddStorageIn = this.SelectStatus == '未入库' ? true : false;
    },
    //新增入库单
    AddStorageIn: function AddStorageIn() {
      var IsSucess = this.GetSelectPOInStockByAdd();
      if (IsSucess == 0) {
        return;
      }
      this.SwitchTab(1);
      this.SwitchAuditFlag(true);
      this.AddStorageInBillNo();
    },
    //新增入库单编号
    AddStorageInBillNo: function AddStorageInBillNo() {var _this2 = this;
      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'getPdaStorageInRptMaxId',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            Result: 0,
            FId: 0,
            FBillNo: '',
            Msg: '' } },


        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext(false);
            return;
          }
          var DataModel = result.data.ResultData.PdaStorageInRpt.dataparam;
          _this2.ShowStorageInBillHeadInfo(DataModel);
          _this2.ShowPOInStockGroupInfoByAdd();
        },
        fail: function fail() {
          Config.ShowMessage('请求数据失败！');
          Config.PopAudioContext(false);
          return;
        },
        complete: function complete(resultcomp) {
          var ResultMsg = resultcomp.data.ResultMsg;
          if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
            Config.ShowMessage(ResultMsg);
            Config.PopAudioContext(false);
          }
        } });

    },
    //查询入库单
    QueryStorageIn: function QueryStorageIn() {
      var IsSuccess = this.GetSelectPOInStockByQuery();
      if (IsSuccess == 0) {
        return;
      }
      this.SwitchTab(1);
      if (this.ProreportStatus == '未审核') {
        this.SwitchAuditFlag(true);
      } else
      {
        this.SwitchAuditFlag(false);
      }
      this.ShowPOInStockGroupInfoByQuery();
    },
    //审核入库单验证
    CheckAuditStorageIn: function CheckAuditStorageIn() {
      if (this.StorageInBillNo == '空') {
        Config.PopAudioContext(false);
        Config.ShowMessage('请新增或者选择入库单！');
        return 0;
      }
      for (var i = 0; i < this.POInstockGroupData.length; i++) {
        var DataModel = this.POInstockGroupData[i];
        if (DataModel.FScannedQty < DataModel.FSumQty)
        {
          Config.PopAudioContext(false);
          Config.ShowMessage('物料编码为' + DataModel.FNumber + '没有完成扫描入库！');
          return 0;
        }
      }
    },
    //审核入库单
    AuditStorageIn: function AuditStorageIn() {var _this3 = this;
      var IsSuccess = this.CheckAuditStorageIn();
      if (IsSuccess == 0) {
        return;
      }
      uni.showLoading({
        title: 'Loading',
        mask: true });

      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'pdaPOInstockRptToStorageInRpt',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            FId: this.StorageInterId,
            Result: 0,
            FStatus: 0,
            FStatusCN: '',
            Msg: '' } },


        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext(false);
            uni.hideLoading();
            return;
          }
          var DataParam = result.data.ResultData.PdaPOInstockRptToStorageInRpt.dataparam;
          var Result = DataParam.Result;
          if (Result == 0) {
            Config.ShowMessage(DataParam.Msg);
            Config.PopAudioContext(false);
            uni.hideLoading();
            return;
          }
          Config.ShowMessage(DataParam.Msg);
          Config.PopAudioContext(true);
          _this3.SwitchAuditFlag(false);
        },
        fail: function fail() {
          Config.ShowMessage('请求数据失败！');
          Config.PopAudioContext(false);
        },
        complete: function complete(resultcomp) {
          var ResultMsg = resultcomp.data.ResultMsg;
          if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
            Config.ShowMessage(ResultMsg);
            Config.PopAudioContext(false);
          }
          uni.hideLoading();
        } });

    },
    //反审核入库单
    UnAuditStorageIn: function UnAuditStorageIn() {var _this4 = this;
      if (this.StorageInBillNo == '空') {
        Config.PopAudioContext(false);
        Config.ShowMessage('请选择入库单！');
        return;
      }
      uni.showLoading({
        title: 'Loading',
        mask: true });

      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'unPOInstockRptToStorageInRpt',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            FId: this.StorageInterId,
            Result: 0,
            FStatus: 0,
            FStatusCN: '',
            Msg: '' } },


        success: function success(result) {
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext(false);
            uni.hideLoading();
            return;
          }
          var DataParam = result.data.ResultData.UnPdaPOInstockRptToStorageInRpt.dataparam;
          var Result = DataParam.Result;
          if (Result == 0) {
            Config.ShowMessage(DataParam.Msg);
            Config.PopAudioContext(false);
            uni.hideLoading();
            return;
          }
          Config.ShowMessage(DataParam.Msg);
          Config.PopAudioContext(true);
          _this4.SwitchAuditFlag(true);
        },
        fail: function fail() {
          Config.ShowMessage('请求数据失败！');
          Config.PopAudioContext(false);
        },
        complete: function complete(resultcomp) {
          var ResultMsg = resultcomp.data.ResultMsg;
          if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
            Config.ShowMessage(ResultMsg);
            Config.PopAudioContext(false);
          }
          uni.hideLoading();
        } });

    },
    //获取选中的收料通知单
    GetSelectPOInStockByAdd: function GetSelectPOInStockByAdd() {
      this.SelectedPOInstock = '';
      this.SelectSupplierArray = [0, '请选择供应商'];
      this.SelectWareHouseArray = [0, '请选择收料仓库'];
      for (var i = 0; i < this.POInstockListData.length; i++) {
        var DataModel = this.POInstockListData[i];
        if (DataModel.FIsChecked) {
          this.SelectedPOInstockModel = DataModel;
          this.SelectedPOInstock += DataModel.FInterID + ',';
          this.StorageInSrcInterId = DataModel.FInterID;
          this.StorageInSrcBillNo = DataModel.FBillNo;
          this.SelectSupplierArray = [DataModel.FSupplyID, DataModel.FSupplyName];
          this.SelectWareHouseArray = [DataModel.FStorageId, DataModel.FStorageName];
          break;
        }
      }
      if (this.SelectedPOInstock != '') {
        this.SelectedPOInstock = this.SelectedPOInstock.substr(0, this.SelectedPOInstock.length - 1);
      } else {
        this.SelectedPOInstock = '0';
      }

      if (this.SelectedPOInstock == '0') {
        Config.ShowMessage('请选择需要新增入库的收料通知单！');
        Config.PopAudioContext(false);
        return 0;
      }
    },
    //获取选中的收料通知单
    GetSelectPOInStockByQuery: function GetSelectPOInStockByQuery() {
      this.SelectedPOInstock = '';
      this.StorageInterId = 0;
      this.StorageInBillNo = '空';
      this.InStorageDate = '';
      this.SelectSupplierArray = [0, '请选择供应商'];
      this.SelectWareHouseArray = [0, '请选择收料仓库'];
      for (var i = 0; i < this.POInstockListData.length; i++) {
        var DataModel = this.POInstockListData[i];
        if (DataModel.FIsChecked) {
          this.SelectedPOInstockModel = DataModel;
          this.SelectedPOInstock += DataModel.FInterID + ',';
          this.StorageInterId = DataModel.FStockBillId;
          this.StorageInBillNo = DataModel.FStockBillNo;
          this.InStorageDate = DataModel.FStockBillDate;
          this.StorageInSrcInterId = DataModel.FPOOrderInterId;
          this.StorageInSrcBillNo = DataModel.FBillNo;
          this.SelectSupplierArray = [DataModel.FSupplyID, DataModel.FSupplyName];
          this.SelectWareHouseArray = [DataModel.FStorageId, DataModel.FStorageName];
          break;
        }
      }
      if (this.SelectedPOInstock != '') {
        this.SelectedPOInstock = this.SelectedPOInstock.substr(0, this.SelectedPOInstock.length - 1);
      } else {
        this.SelectedPOInstock = '0';
      }

      if (this.SelectedPOInstock == '0') {
        Config.ShowMessage('请选择需要查询入库的收料通知单！');
        Config.PopAudioContext(false);
        return 0;
      }
    },
    //显示入库单单据头信息
    ShowStorageInBillHeadInfo: function ShowStorageInBillHeadInfo(DataModel) {
      this.StorageInterId = DataModel.FId;
      this.StorageInBillNo = DataModel.FBillNo;
      this.InStorageDate = Config.DateFormat({
        format: true });

      this.StorageInListData = [];
    },
    //显示收料通知单分组信息
    ShowPOInStockGroupInfoByAdd: function ShowPOInStockGroupInfoByAdd() {var _this5 = this;
      uni.showLoading({
        title: 'Loading',
        mask: true });

      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'getPdaPOInStockGroupInfo',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            FIndexIdList: this.SelectedPOInstock } },


        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext();
            uni.hideLoading();
            return;
          }
          _this5.POInstockGroupData = result.data.ResultData.PdaPOInStockGroupInfo.data0;
          _this5.GetBillSelectItem();
        },
        fail: function fail() {
          Config.ShowMessage('请求数据失败！');
          Config.PopAudioContext();
        },
        complete: function complete(resultcomp) {
          var ResultMsg = resultcomp.data.ResultMsg;
          if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
            Config.PopAudioContext(false);
            Config.ShowMessage(ResultMsg);
          }
          uni.hideLoading();
        } });

    },
    //显示收料通知单分组信息
    ShowPOInStockGroupInfoByQuery: function ShowPOInStockGroupInfoByQuery() {var _this6 = this;
      uni.showLoading({
        title: 'Loading',
        mask: true });

      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'getPdaPOInStockGroupInfo',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            FIndexIdList: this.SelectedPOInstock } },


        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext();
            uni.hideLoading();
            return;
          }
          _this6.POInstockGroupData = result.data.ResultData.PdaPOInStockGroupInfo.data0;
          _this6.GetBillSelectItem();
        },
        fail: function fail() {
          Config.ShowMessage('请求数据失败！');
          Config.PopAudioContext();
        },
        complete: function complete(resultcomp) {
          var ResultMsg = resultcomp.data.ResultMsg;
          if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
            Config.PopAudioContext(false);
            Config.ShowMessage(ResultMsg);
          }
          uni.hideLoading();
        } });

    },
    //根据收料通知单信息获取扩展信息
    GetPOInstockInfoExpand: function GetPOInstockInfoExpand(item) {
      if (item != null) {
        this.SelectGroupModel = item;
        this.TabSelectedIndex = 2;
      } else {

      }
    },
    //获取入库单外箱明细信息
    GetStorageInCartonDetail: function GetStorageInCartonDetail() {
      uni.showLoading({
        title: 'Loading' });

      uni.navigateTo({
        url: '/pages/purchaseinstorage/cartonlabeldetail?StorageInterId=' + this.StorageInterId +
        '&StorageInSrcInterId=' + this.StorageInSrcInterId });

      uni.hideLoading();
    },
    //获取选中单据的物料信息
    GetBillSelectItem: function GetBillSelectItem() {
      this.SelectItems = '';
      for (var i = 0; i < this.POInstockGroupData.length; i++) {
        var DataModel = this.POInstockGroupData[i];
        this.SelectItems += DataModel.FItemID + ',';
      }
      this.SelectItems = this.SelectItems.substr(0, this.SelectItems.length - 1);
    },
    //扫描条码做入库
    ScanBarCode: function ScanBarCode(Barcode) {var _this7 = this;
      if (this.StorageInBillNo == '空') {
        Config.PopAudioContext(false);
        Config.ShowMessage('请新增入库单！');
        return;
      }

      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'addPdaStockBillRpt',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            FId: this.StorageInterId,
            FDate: this.InStorageDate,
            FFManagerID: this.SelectedPOInstockModel.FFManagerID,
            FSManagerID: this.SelectedPOInstockModel.FSManagerID,
            FBillerID: uni.getStorageSync('FUserId'),
            FBillNo: this.StorageInBillNo,
            FDeptID: this.SelectedPOInstockModel.FDeptID,
            FManagerID: this.SelectedPOInstockModel.FManagerID,
            FEmpID: this.SelectedPOInstockModel.FEmpID,
            FSupplyID: this.SelectedPOInstockModel.FSupplyID,
            FPackBarCode: Barcode,
            FSrcInterId: this.SelectedPOInstockModel.FInterID,
            FStorageId: this.SelectedPOInstockModel.FStorageId,
            FStorageBinId: this.SelectedPOInstockModel.FStorageBinId,
            FICItems: this.SelectItems,
            Result: 0,
            Msg: '' } },


        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext(false);
            return;
          }
          var ResultData = result.data.ResultData.AddPdaStockBillRpt;
          var Result = ResultData.dataparam.Result;
          if (Result == 0) {
            Config.ShowMessage(ResultData.dataparam.Msg);
            Config.PopAudioContext(false);
            return;
          }
          Config.ShowMessage(ResultData.dataparam.Msg);
          Config.PopAudioContext(true);
          if (_this7.IsAddStorageIn) {
            _this7.ShowPOInStockGroupInfoByAdd();
          } else {
            _this7.ShowPOInStockGroupInfoByQuery();
          }
        },
        fail: function fail() {
          Config.ShowMessage('请求数据失败！');
          Config.PopAudioContext(false);
          return;
        },
        complete: function complete(resultcomp) {
          var ResultMsg = resultcomp.data.ResultMsg;
          if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
            Config.PopAudioContext(false);
            Config.ShowMessage(ResultMsg);
          }
        } });

    },
    //删除外购入库单
    DeleteStorageIn: function DeleteStorageIn() {
      if (this.StorageInBillNo == '空') {
        Config.ShowMessage('请选择要删除的入库单！');
        Config.PopAudioContext(false);
        return;
      }
      var me = this;
      uni.showModal({
        title: '提示',
        content: '是否需要删除单据编号为' + me.StorageInBillNo + '的入库单？',
        success: function success(result) {
          if (result.confirm) {
            uni.request({
              url: uni.getStorageSync('OtherUrl'),
              method: 'POST',
              data: {
                ModuleCode: 'delPdaStockBillRptHead',
                token: uni.getStorageSync('token'),
                ModuleParam: {
                  FId: me.StorageInterId,
                  Result: 0,
                  FStatus: 0,
                  FStatusCN: '',
                  Msg: '' } },


              success: function success(resdelete) {
                var ResultCode = resdelete.data.ResultCode;
                var ResultMsg = resdelete.data.ResultMsg;
                if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
                  Config.ShowMessage('账号登录异常，请重新登录！');
                  Config.PopAudioContext(false);
                  return;
                }
                var DataParam = resdelete.data.ResultData.DelPdaStockBillRptHead.
                dataparam;
                ResultCode = DataParam.Result;
                if (ResultCode == 0) {
                  Config.ShowMessage(DataParam.Msg);
                  Config.PopAudioContext(false);
                  return;
                }
                me.ClearBillHeadData(me);
                me.SwitchTab(0);
                Config.ShowMessage(DataParam.Msg);
                Config.PopAudioContext(true);
              },
              fail: function fail() {
                Config.ShowMessage('请求数据失败！');
                Config.PopAudioContext(false);
              },
              complete: function complete(resultcomp) {
                var ResultMsg = resultcomp.data.ResultMsg;
                if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
                  Config.ShowMessage(ResultMsg);
                  Config.PopAudioContext(false);
                }
              } });

          }
        } });

    },
    //选择入库日期
    InStorageDateChange: function InStorageDateChange(e) {
      this.InStorageDate = e.detail.value;
    },
    //条件搜索采购订单列表
    ValueChanged: function ValueChanged() {
      this.ShowPOInstockInfo('');
    } } };exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 107:
/*!**********************************************************************************************************************!*\
  !*** D:/所有公司工作资料/金蝶/开发项目/KDPDA/KDPDA/pages/purchaseinstorage/purchaseinstorage.vue?vue&type=style&index=0&lang=css& ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../../开发插件/HBuilderX.3.1.13.20210514.full/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./purchaseinstorage.vue?vue&type=style&index=0&lang=css& */ 108);
/* harmony import */ var _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_HBuilderX_3_1_13_20210514_full_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_purchaseinstorage_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 108:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/所有公司工作资料/金蝶/开发项目/KDPDA/KDPDA/pages/purchaseinstorage/purchaseinstorage.vue?vue&type=style&index=0&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[101,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/purchaseinstorage/purchaseinstorage.js.map