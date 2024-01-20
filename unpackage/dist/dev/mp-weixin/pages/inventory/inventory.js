(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/inventory/inventory"],{

/***/ 181:
/*!***********************************************************************************!*\
  !*** D:/项目/202212宏力/KDPDA/KDPDA/main.js?{"page":"pages%2Finventory%2Finventory"} ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _inventory = _interopRequireDefault(__webpack_require__(/*! ./pages/inventory/inventory.vue */ 182));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_inventory.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 182:
/*!****************************************************************!*\
  !*** D:/项目/202212宏力/KDPDA/KDPDA/pages/inventory/inventory.vue ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inventory.vue?vue&type=template&id=783aa900& */ 183);
/* harmony import */ var _inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inventory.vue?vue&type=script&lang=js& */ 185);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _inventory_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./inventory.vue?vue&type=style&index=0&lang=css& */ 187);
/* harmony import */ var _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__["render"],
  _inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/inventory/inventory.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 183:
/*!***********************************************************************************************!*\
  !*** D:/项目/202212宏力/KDPDA/KDPDA/pages/inventory/inventory.vue?vue&type=template&id=783aa900& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./inventory.vue?vue&type=template&id=783aa900& */ 184);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_template_id_783aa900___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 184:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/项目/202212宏力/KDPDA/KDPDA/pages/inventory/inventory.vue?vue&type=template&id=783aa900& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var g0 = _vm.ProcessModel.length
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 185:
/*!*****************************************************************************************!*\
  !*** D:/项目/202212宏力/KDPDA/KDPDA/pages/inventory/inventory.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./inventory.vue?vue&type=script&lang=js& */ 186);
/* harmony import */ var _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 186:
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/项目/202212宏力/KDPDA/KDPDA/pages/inventory/inventory.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Config = function Config() {
  __webpack_require__.e(/*! require.ensure | common/config */ "common/vendor").then((function () {
    return resolve(__webpack_require__(/*! ../../common/config.js */ 47));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var InventoryPlan = function InventoryPlan() {
  __webpack_require__.e(/*! require.ensure | components/inventory-plan/inventory-plan */ "components/inventory-plan/inventory-plan").then((function () {
    return resolve(__webpack_require__(/*! ../../components/inventory-plan/inventory-plan.vue */ 425));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var InventoryStock = function InventoryStock() {
  __webpack_require__.e(/*! require.ensure | components/inventory-stock/inventory-stock */ "components/inventory-stock/inventory-stock").then((function () {
    return resolve(__webpack_require__(/*! ../../components/inventory-stock/inventory-stock.vue */ 432));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var InventoryArea = function InventoryArea() {
  __webpack_require__.e(/*! require.ensure | components/inventory-area/inventory-area */ "components/inventory-area/inventory-area").then((function () {
    return resolve(__webpack_require__(/*! ../../components/inventory-area/inventory-area.vue */ 439));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    Config: Config,
    InventoryPlan: InventoryPlan,
    InventoryStock: InventoryStock,
    InventoryArea: InventoryArea
  },
  data: function data() {
    return {
      ProcessList: [],
      WareHouseList: [],
      InventoryAreaList: [],
      SelectProcess: '',
      SelectWareHouse: '',
      SelectInventoryArea: '',
      ProcessModel: [],
      WareHouseModel: [],
      InventoryAreaModel: [],
      PopTitle: '',
      IsOpenDigitKeyboard: false
    };
  },
  onLoad: function onLoad() {
    this.GetAllInventoryPlan();
  },
  methods: {
    //进入盘点界面
    EnterInventory: function EnterInventory() {
      if (this.SelectProcess == '') {
        Config.ShowMessage('请选择盘点方案！');
        Config.PopAudioContext(false);
        return;
      }
      if (this.SelectWareHouse == '') {
        Config.ShowMessage('请选择盘点仓库！');
        Config.PopAudioContext(false);
        return;
      }
      if (this.SelectInventoryArea == '') {
        Config.ShowMessage('请选择盘点区域！');
        Config.PopAudioContext(false);
        return;
      }
      uni.navigateTo({
        url: '/pages/inventory/scaninventory?WareHouseModel=' + this.WareHouseModel + '&ProcessModel=' + this.ProcessModel + '&InventoryAreaModel=' + this.InventoryAreaModel
      });
    },
    //更新盘点报告单
    UpdateInventoryReport: function UpdateInventoryReport() {
      if (this.SelectProcess == '') {
        Config.ShowMessage('请选择盘点方案！');
        Config.PopAudioContext(false);
        return;
      }
      uni.showLoading({
        title: 'Loading',
        mask: true
      });
      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'UpdateInventoryReport',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            FProcessId: this.ProcessModel.FID,
            FUserId: uni.getStorageSync('FUserId'),
            Result: 0,
            Msg: ''
          }
        },
        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext(false);
            return;
          }
          var ResultData = result.data.ResultData.UpdateInventoryReport;
          var Result = ResultData.dataparam.Result;
          if (Result == 0) {
            Config.ShowMessage(ResultData.dataparam.Msg);
            Config.PopAudioContext(false);
            return;
          }
          Config.ShowMessage(ResultData.dataparam.Msg);
          Config.PopAudioContext(true);
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
          uni.hideLoading();
        }
      });
    },
    //切换盘点方案
    SwitchInventoryPlan: function SwitchInventoryPlan() {
      this.GetSelectInventoryPlan();
      this.GetAllWareHouse();
      this.ClearWareHouse();
      this.ClearInventoryArea();
    },
    //获取选中的盘点方案
    GetSelectInventoryPlan: function GetSelectInventoryPlan() {
      var _this = this;
      this.ProcessModel = this.ProcessList.find(function (item) {
        return item.FProcessID == _this.SelectProcess;
      });
    },
    //获取所有盘点方案
    GetAllInventoryPlan: function GetAllInventoryPlan() {
      var _this2 = this;
      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'GetProcessListInfo',
          token: uni.getStorageSync('token'),
          ModuleParam: {}
        },
        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext(false);
            return;
          }
          _this2.ProcessList = result.data.ResultData.GetProcessListInfo.data0;
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
        }
      });
    },
    //清空仓库信息
    ClearWareHouse: function ClearWareHouse() {
      this.WareHouseModel = null;
      this.SelectWareHouse = '';
    },
    ClearInventoryArea: function ClearInventoryArea() {
      this.InventoryAreaModel = null;
      this.SelectInventoryArea = '';
    },
    //切换仓库信息
    SwitchWareHouse: function SwitchWareHouse() {
      this.GetSelectWareHouse();
      this.GetAllInventoryArea();
      this.ClearInventoryArea();
    },
    //获取选中仓库信息
    GetSelectWareHouse: function GetSelectWareHouse() {
      var _this3 = this;
      this.WareHouseModel = this.WareHouseList.find(function (item) {
        return item.FName == _this3.SelectWareHouse;
      });
    },
    //获取所有仓库信息
    GetAllWareHouse: function GetAllWareHouse() {
      var _this4 = this;
      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'GetStockByInvPlan',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            FInvPlanId: this.ProcessModel.FID
          }
        },
        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext(false);
            return;
          }
          _this4.WareHouseList = result.data.ResultData.GetStockByInvPlan.data0;
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
        }
      });
    },
    GetAllInventoryArea: function GetAllInventoryArea() {
      var _this5 = this;
      uni.request({
        url: uni.getStorageSync('OtherUrl'),
        method: 'POST',
        data: {
          ModuleCode: 'GetInventoryAreaByStock',
          token: uni.getStorageSync('token'),
          ModuleParam: {
            FStockId: this.WareHouseModel.FItemID
          }
        },
        success: function success(result) {
          //console.log(result.data);
          var ResultCode = result.data.ResultCode;
          var ResultMsg = result.data.ResultMsg;
          if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
            Config.ShowMessage('账号登录异常，请重新登录！');
            Config.PopAudioContext(false);
            return;
          }
          _this5.InventoryAreaList = result.data.ResultData.GetInventoryAreaByStock.data0;
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
        }
      });
    },
    //获取选中仓库信息
    GetSelectInventoryArea: function GetSelectInventoryArea() {
      var _this6 = this;
      this.InventoryAreaModel = this.InventoryAreaList.find(function (item) {
        return item.FName == _this6.SelectInventoryArea;
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 187:
/*!*************************************************************************************************!*\
  !*** D:/项目/202212宏力/KDPDA/KDPDA/pages/inventory/inventory.vue?vue&type=style&index=0&lang=css& ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./inventory.vue?vue&type=style&index=0&lang=css& */ 188);
/* harmony import */ var _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_C_Program_Files_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_inventory_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 188:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/项目/202212宏力/KDPDA/KDPDA/pages/inventory/inventory.vue?vue&type=style&index=0&lang=css& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[181,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/inventory/inventory.js.map