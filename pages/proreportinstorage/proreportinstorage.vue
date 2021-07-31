<template>
	<view class="content">
		<view class="proreportview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus" @input="ShowPdaIcmoInfo()">
			</billstatus>
			<button class="addstoragein" v-bind:disabled="!IsAddStorageIn" v-on:click="AddStorageIn()">新增</button>
			<button class="querystoragein" v-bind:disabled="IsAddStorageIn" v-on:click="QueryStorageIn()">查询</button>
			<scroll-view class="icmoscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in IcmoListData" :key="index" :title="'汇报单制单人：'
				   + item.FBillerName + '\n'+ '汇报单制单日期：' + item.FDate + '\n' + '汇报单编号：' + item.FBillNo" clickable
						:ischecked="item.FIsChecked" :isshowcheckbox="true" @CheckBoxChange="ChangeIsChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>



		<view class="proreportview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
			<button class="deletestoragein" v-on:click="DeleteStorageIn()">删除</button>
			<button class="auditstoragein" v-on:click="AuditStorageIn()">审核</button>
			<button class="unauditstoragein" v-on:click="UnAuditStorageIn()">反审</button>

			<view class="billhead" v-show="IsBillHeadVisible">
				<text class="title">单据编号：</text>
				<text class="billnoempty"
					v-bind:class="{billnofull : StorageInBillNo != '空'}">{{StorageInBillNo}}</text>
				<view class="dataline"></view>

				<text class="title">交货单位：</text>
				<navigator url="/pages/basic/workshopquery" hover-class="navigator-hover">
					<view class="data">{{SelectWorkShopArray[1]}}</view>
				</navigator>
				<view class="dataline"></view>

				<text class="title">入库日期：</text>
				<picker mode="date" :value="InStorageDate" :start="StartDate" :end="EndDate"
					@change="InStorageDateChange">
					<view class="data">{{InStorageDate}}</view>
				</picker>
				<view class="dataline"></view>
			</view>

			<scroll-view class="unselectinfoscrollview" v-bind:class="{selectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in StorageInListData" :key="index" :title="item.FNumber + '/' 
					+ item.FModel + '\n' + '汇报单编号：' + item.FBillNo + '\n' + '源单编号：' + item.FSrcBillNo
					+ '\n' + '入库进度：' + item.FStorageInCount + '/' + item.FSumQty" isshowprogress
						v-bind:percent="Math.round((item.FStorageInCount / item.FSumQty) * 100, 0)" clickable
						v-on:click="GetProReportInfoExpand(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>



		<view class="proreportview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
			<text class="scanned">已扫描条码：</text>
			<text class="queryall" clickable v-on:click="GetStorageInCartonDetail()">查看全部</text>

			<scroll-view class="detailscrollview" scroll-y="true">
				<text class="detailtitle">物料编码：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FNumber : '空'}}</text>
				<text class="detailtitle">物料名称：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FName : '空'}}</text>
				<text class="detailtitle">标签类型：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FBarCodeType : '空'}}</text>
				<text class="detailtitle">订单号：</text>
				<text class="detaildata">{{(this.ProreportInfoItem != null && this.ProreportInfoItem.FSOBillNo != null) ? this.ProreportInfoItem.FSOBillNo : '空'}}</text>
				<text class="detailtitle">仓库编码：</text>
				<text class="detaildata">{{this.ProReportSelectIndex != -1 ? this.StorageInAndBinArray[this.ProReportSelectIndex][1] : '空'}}</text>
				<text class="detailtitle">仓库名称：</text>
				<text class="detaildata">{{this.ProReportSelectIndex != -1 ? this.StorageInAndBinArray[this.ProReportSelectIndex][2] : '空'}}</text>
				<text class="detailtitle">仓位编码：</text>
				<text class="detaildata">{{this.ProReportSelectIndex != -1 ? this.StorageInAndBinArray[this.ProReportSelectIndex][4] : '空'}}</text>
				<text class="detailtitle">仓位名称：</text>
				<text class="detaildata">{{this.ProReportSelectIndex != -1 ? this.StorageInAndBinArray[this.ProReportSelectIndex][5] : '空'}}</text>
			</scroll-view>
		</view>


·
		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">汇报单</text>
			<view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>
			<text class="tabmiddle" v-bind:class="{selecttab : TabSelectedIndex == 1}"
				v-on:click="SwitchTab(1)">入库单</text>
			<view class="tabmiddleline" v-bind:class="{selecttabline : TabSelectedIndex == 1}"></view>
			<text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 2}"
				v-on:click="SwitchTab(2)">明细</text>
			<view class="tabrightline" v-bind:class="{selecttabline : TabSelectedIndex == 2}"></view>
		</view>
	</view>
</template>

<script>
	import Config from '../../common/config.js';
	export default {
		data() {
			return {
				TabSelectedIndex: 0,
				SearchValue: '',
				SelectStatus: '未入库',
				StorageInterId: 0,
				StorageInBillNo: '空',
				ProReportInterId: 0,
				ProReportSrcInterId: 0,
				ProReportSelectIndex: -1,
				IsBillHeadVisible: true,
				IsAddStorageIn: true,
				StorageBinIsActive: false,
				SelectWorkShopArray: [0, '请选择交货单位'],
				StatusArray: ['未入库', '已入库'],
				StorageInAndBinArray: [],
				InStorageDate: DateFormat({
					format: true
				}),
				StartDate: DateFormat('start'),
				EndDate: DateFormat('end'),
				IcmoListData: [],
				StorageInListData: [],
				SelectedProreport: '',
				SelectedIcmo: '',
				ProreportInfoItem: null,
				TouchStartX: 0,
				SlidingValue: 100,
				Main: '',
				Receiver: ''
			}
		},
		onLoad() {
			this.AddListener();
			this.GetGblSetting();
			this.ShowPdaIcmoInfo();
		},
		onUnload() {
			this.RemoveListener();
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		methods: {
			//添加广播监听
			AddListener: function() {
				var me = this;
				var main = plus.android.runtimeMainActivity(); //获取activity    
				var context = plus.android.importClass('android.content.Context'); //上下文    
				var receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: doReceive
				});
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
						me.CheckedProreport(Barcode);
					} else if (me.TabSelectedIndex == 1) {
						me.ScanBarCode(Barcode);
					} else {
						me.ScanWareHouse(Barcode);
					}
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},			
			//检测汇报单是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
			},
			//选中汇报单
			CheckedProreport: function(BarCode) {
				for (var i = 0; i < this.IcmoListData.length; i++) {
					if (this.IcmoListData[i].FBillNo == BarCode) {
						this.IcmoListData[i].FIsChecked = true;
					}
				}
			},
			//获取系统参数
			GetGblSetting: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getStorageBinIsActive',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FSignalKey: 'StorageBinIsActive'
						}
					},
					success: (result) => {
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							return;
						}
						this.StorageBinIsActive = result.data.ResultData.getStorageBinIsActiveInfo.data0
							.FValue;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
						}
					}
				});
			},			
			//获取手指滑动页面的起点
			TouchStart: function(e) {
				this.TouchStartX = e.changedTouches[0].clientX;
			},
			//获取手指滑动页面的终点
			TouchEnd: function(e) {
				let TouchEndX = e.changedTouches[0].clientX;
				if (this.TouchStartX - TouchEndX >= this.SlidingValue && this.TabSelectedIndex < 2) {
					this.SlidingPage(true);
				}
				if (TouchEndX - this.TouchStartX >= this.SlidingValue && this.TabSelectedIndex > 0) {
					this.SlidingPage(false);
				}
			},
			//切换页签
			SwitchTab: function(TabSelectedIndex) {
				if (this.TabSelectedIndex != TabSelectedIndex) {
					this.TabSelectedIndex = TabSelectedIndex;
					if (this.TabSelectedIndex == 0) {
						
					} 
					else if (this.TabSelectedIndex == 1) {
						// if (this.IsAddStorageIn) {
						// 	this.ShowProReportGroupInfoByAdd();
						// } else {
						// 	this.ShowProReportGroupInfoByQuery();
						// }
					} else {}
				}
			},
			//滑动页面
			SlidingPage: function(IsSlidingLeftPage) {
				if (IsSlidingLeftPage) {
					this.TabSelectedIndex++;
				} else {
					this.TabSelectedIndex--;
				}

				if (this.TabSelectedIndex == 0) {
					
				} 
				else if (this.TabSelectedIndex == 1) {
					// if (this.IsAddStorageIn) {
					// 	this.ShowProReportGroupInfoByAdd();
					// } else {
					// 	this.ShowProReportGroupInfoByQuery();
					// }
				} else {
					
				}
			},
			//显示汇报单
			ShowPdaIcmoInfo: function() {
				if (this.SelectStatus == '未入库') {
					this.IsAddStorageIn = true;
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaIcmoRptNoPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FBillNo: this.SearchValue,
								FBillerID: uni.getStorageSync('FUserId')
							}
						},
						success: (result) => {
							//console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								uni.hideLoading();
								return;
							}
							uni.hideLoading();
							this.IcmoListData = result.data.ResultData.getPdaIcmoRptNoPutInListInfo.data0;
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
							uni.hideLoading();
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.PopAudioContext(false);
								Config.ShowMessage(ResultMsg);
								uni.hideLoading();
							}
						}
					});
				} else {
					this.IsAddStorageIn = false;
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaIcmoRptPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FBillNo: this.SearchValue,
								FBillerID: uni.getStorageSync('FUserId')
							}
						},
						success: (result) => {
							//console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								uni.hideLoading();
								return;
							}
							uni.hideLoading();
							this.IcmoListData = result.data.ResultData.getPdaIcmoRptPutInListInfo.data0;
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
							uni.hideLoading();
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.PopAudioContext(false);
								Config.ShowMessage(ResultMsg);
								uni.hideLoading();
							}
						}
					});
				}
			},
			//显示入库单列表
			ShowStorageInfo: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaStorageInRptList',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FBillNo: this.SearchValue,
							FBillerID: uni.getStorageSync('FUserId')
						}
					},
					success: (result) => {
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							return;
						}
						this.StorageInListData = result.data.ResultData.getPdaStorageInRptListInfo.data0;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
						}
					}
				});
			},			
			//获取选中的汇报单
			GetSelectProreportByQuery: function() {
				this.SelectedProreport = '';
				this.SelectedIcmo = '';
				this.StorageInBillNo = '';
				this.StorageInterId = 0;
				this.InStorageDate = '';
				for (var i = 0; i < this.IcmoListData.length; i++) {
					if (this.IcmoListData[i].FIsChecked) {
						this.SelectedProreport += this.IcmoListData[i].FId + ',';
						this.SelectedIcmo += this.IcmoListData[i].FSrcInterId + ',';
						this.StorageInBillNo = this.IcmoListData[i].FBillNoStorageIn;
						this.StorageInterId = this.IcmoListData[i].FStorageInId;
						this.SelectWorkShopArray = [this.IcmoListData[i].FWorkShopId, this.IcmoListData[i]
							.FWorkShopName
						];
						this.InStorageDate = this.IcmoListData[i].FDateStorageIn;
					}
				}
				if (this.SelectedProreport != '') {
					this.SelectedProreport = this.SelectedProreport.substr(0, this.SelectedProreport.length - 1);
					this.SelectedIcmo = this.SelectedIcmo.substr(0, this.SelectedIcmo.length - 1);
				} else {
					this.SelectedProreport = '0';
					this.SelectedIcmo = '0';
				}

				if (this.SelectedProreport == '0') {
					Config.ShowMessage('请选择需要查询入库的汇报单！');
					Config.PopAudioContext(false);
					return 0;
				}
				if (this.SelectedProreport.indexOf(',') != -1) {
					Config.ShowMessage('一次只能选择一张汇报单进行入库查询！');
					Config.PopAudioContext(false);
					return 0;
				}
			},
			//获取选中的汇报单
			GetSelectProreportByAdd: function() {
				this.SelectedProreport = '';
				this.SelectedIcmo = '';
				this.StorageInBillNo = '';
				this.InStorageDate = '';
				for (var i = 0; i < this.IcmoListData.length; i++) {
					if (this.IcmoListData[i].FIsChecked) {
						this.SelectedProreport += this.IcmoListData[i].FId + ',';
						this.SelectedIcmo += this.IcmoListData[i].FSrcInterId + ',';
					}
				}
				if (this.SelectedProreport != '') {
					this.SelectedProreport = this.SelectedProreport.substr(0, this.SelectedProreport.length - 1);
					this.SelectedIcmo = this.SelectedIcmo.substr(0, this.SelectedIcmo.length - 1);
				} else {
					this.SelectedProreport = '0';
					this.SelectedIcmo = '0';
				}

				if (this.SelectedProreport == '0') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择需要新增入库的汇报单！');
					return 0;
				}
			},
			//检测扫描条码
			CheckScanBarCode: function() {
				if (this.StorageInBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请新增入库单！');
					return 0;
				}
				if (this.SelectWorkShopArray[0] == 0) {
					Config.PopAudioContext(false);
					Config.ShowMessage('请填写交货单位！');
					return 0;
				}				
			},
			//扫描条码
			ScanBarCode: function(Barcode) {
				let IsSuccess = this.CheckScanBarCode();
				if (IsSuccess == 0) {
					return;
				}

				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'addPdaStorageInRpt',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageInterId,
							FBillNo: this.StorageInBillNo,
							FWorkShopId: this.SelectWorkShopArray[0],
							FDate: this.InStorageDate,
							FBillerID: uni.getStorageSync('FUserId'),
							FPackBarCode: Barcode,
							FStorageId: this.ProreportInfoItem.FStorageId,
							FStorageBinId: 0,
							FIcmoRptIds: this.SelectedProreport,
							FIcmoRptId: '',
							Result: 0,
							Msg: ''
						}
					},
					success: (result) => {
						console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);

							return;
						}
						let ResultData = result.data.ResultData.AddPdaStorageInRpt;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);

							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);

						// if (this.IsAddStorageIn) {
						// 	this.ShowProReportGroupInfoByAdd();
						// } else {
						// 	this.ShowProReportGroupInfoByQuery();
						// }
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);

					},
					complete: (resultcomp) => {
						console.log(resultcomp.data);
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);

						}
					}
				});
			},
			//扫描仓库
			ScanWareHouse: function(BarCode) {
				let me = this;
				if (me.StorageInBillNo == '空') {
					Config.ShowMessage('请新增入库单！');
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
						ModuleCode: 'getStockByNumber',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FNumber: BarCode
						}
					},
					success: (result) => {
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
			
						if (me.StorageBinIsActive == 'true') {
			
						} else {
							let DataModel = result.data.ResultData.getStockByNumberInfo.data0;
							me.StorageInAndBinArray[me.ProReportSelectIndex] = [DataModel.FItemID, DataModel.FNumber, DataModel.FName, 0, '空', '空'];	
							console.log(me.StorageInAndBinArray);
						}
						Config.ShowMessage('扫描仓库仓位成功！');
						Config.PopAudioContext(true);
						uni.hideLoading();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						uni.hideLoading();
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
							uni.hideLoading();
						}
					}
				});
			},
			//新增入库单
			AddStorageIn: function() {
				let IsSucess = this.GetSelectProreportByAdd();
				if (IsSucess == 0) {
					return;
				}
				this.SwitchTab(1);
				this.AddStorageInBillNo();
				this.ShowProReportGroupInfoByAdd();				
			},
			//新增入库单编号
			AddStorageInBillNo: function() {
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
							Msg: ''
						}
					},
					success: (result) => {
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							return;
						}
						let DataModel = result.data.ResultData.PdaStorageInRpt.dataparam;
						this.StorageInterId = DataModel.FId;
						this.StorageInBillNo = DataModel.FBillNo;
						this.InStorageDate = DateFormat({
							format: true,
						});
						this.StorageInListData = [];
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
						}
					}
				});
			},
			//显示生产汇报单分组信息
			ShowProReportGroupInfoByAdd: function() {				
				if (this.SelectedProreport != '') {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaICMORptGroupInfo',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FIndexIdList: this.SelectedProreport
							}
						},
						success: (result) => {
							//console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext();
								uni.hideLoading();
								return;
							}							
							uni.hideLoading();
							this.StorageInListData = result.data.ResultData.PdaICMORptGroupInfo.data0;							
							this.StorageInAndBinArray = [];						
							for (let i = 0; i < this.StorageInListData.length; i++) {
								let StorageInAndBinInfo = [0, '空', '空', 0, '空', '空'];
								this.StorageInAndBinArray.push(StorageInAndBinInfo);
							}								
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext();
							uni.hideLoading();
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.PopAudioContext(false);
								Config.ShowMessage(ResultMsg);
								uni.hideLoading();
							}							
						}
					});
				}
			},
			//显示生产汇报单分组信息
			ShowProReportGroupInfoByQuery: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaICMORptGroupInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FIndexIdList: this.SelectedProreport
						}
					},
					success: (result) => {
						console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext();
							uni.hideLoading();
							return;
						}
						uni.hideLoading();
						this.StorageInListData = result.data.ResultData.PdaICMORptGroupInfo.data0;
						this.StorageInAndBinArray = [];
						for (let i = 0; i < this.StorageInListData.length; i++) {
							let DataModel = this.StorageInListData[i];
							let StorageInAndBinInfo = [DataModel.FStorageId, DataModel.FStorageNumber, DataModel.FStorageName
							, DataModel.FStorageBinId, DataModel.FStorageBinNumber, DataModel.FStorageBinName];
							this.StorageInAndBinArray.push(StorageInAndBinInfo);
						}
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
						uni.hideLoading();
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
							uni.hideLoading();
						}
					}
				});
			},
			//查询入库单
			QueryStorageIn: function() {
				let IsSuccess = this.GetSelectProreportByQuery();
				if (IsSuccess == 0) {
					return;
				}
				this.SwitchTab(1);
				this.ShowProReportGroupInfoByQuery();
			},
			//审核入库单验证
			CheckAuditStorageIn:function(){
				if (this.StorageInBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请新增或者选择入库单！');
					return 0;
				}
				if (this.SelectWorkShopArray[0] == 0) {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择交货单位！');
					return 0;
				}
				for (var i = 0; i < this.StorageInAndBinArray.length; i++) {
					let BasicDataModel = this.StorageInAndBinArray[i];
					let BillDataModel = this.StorageInListData[i];					
					if(this.StorageBinIsActive == 'true'){
						if(BasicDataModel[3] == 0){
							Config.PopAudioContext(false);
							Config.ShowMessage('汇报单编号为' + BillDataModel.FBillNo + '没有填写仓位！');
							return 0;
						}
					}
					else{
						if(BasicDataModel[0] == 0){
							Config.PopAudioContext(false);
							Config.ShowMessage('汇报单编号为' + BillDataModel.FBillNo + '没有填写仓库！');
							return 0;
						}
					}					
				}				
			},
			//审核入库单
			AuditStorageIn: function() {
				let IsSuccess = this.CheckAuditStorageIn();
				if(IsSuccess == 0){
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
						ModuleCode: 'pdaICMORptToStorageInRpt',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageInterId,
							Result: 0,
							FStatus: 0,
							FStatusCN: '',
							Msg: ''
						}
					},
					success: (result) => {
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							uni.hideLoading();							
							return;
						}
						let DataParam = result.data.ResultData.PdaICMORptToStorageInRpt.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();							
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
						uni.hideLoading();						
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						uni.hideLoading();						
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
							uni.hideLoading();							
						}
					}
				});
			},
			//反审核入库单
			UnAuditStorageIn: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'unPdaICMORptToStorageInRpt',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageInterId,
							Result: 0,
							FStatus: 0,
							FStatusCN: '',
							Msg: ''
						}
					},
					success: (result) => {
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						let DataParam = result.data.ResultData.UnPdaICMORptToStorageInRpt.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
						uni.hideLoading();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						uni.hideLoading();
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);
							uni.hideLoading();
						}
					}
				});
			},
			//删除入库单
			DeleteStorageIn: function() {},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//清除单据头数据
			ClearBillHeadData: function(me) {
				me.StorageInterId = 0;
				me.StorageInBillNo = '空';
				me.ProReportSrcInterId = 0;
				me.SelectWorkShopArray = [0, '请选择交货单位'];
				me.InStorageDate = DateFormat({
					format: true
				});
			},
			//获取入库单外箱明细信息
			GetStorageInCartonDetail: function() {
				uni.showLoading({
					title: 'Loading'
				});
				uni.navigateTo({
					url: '/pages/proreportinstorage/cartonlabeldetail?StorageInterId=' + this.StorageInterId +
						'&ProReportSrcInterId=' + this.ProReportSrcInterId
				});
				uni.hideLoading();
			},
			//根据汇报单信息获取扩展信息
			GetProReportInfoExpand: function(item) {
				if (item != null) {						
					this.TabSelectedIndex = 2;
					this.ProReportSelectIndex = item.FIndex;
					this.ProreportInfoItem = item;
					this.ProReportInterId = item.FId;
					this.ProReportSrcInterId = item.FSrcInterId;
				} else {
					this.ProreportInfoItem = null;
				}
			},
			//汇总页面选中的Item
			SummaryItemSelected: function(item) {
				this.GetProReportInfoBySum(item);
			},			
			//选择入库日期
			InStorageDateChange(e) {
				this.InStorageDate = e.detail.value
			},
			//条件搜索汇报单列表
			ValueChanged: function() {
				this.ShowPdaIcmoInfo();
			}
		}
	}
	//获取选中的日期格式化
	function DateFormat(type) {
		const CurrentDate = new Date();
		let Year = CurrentDate.getFullYear();
		let Month = CurrentDate.getMonth() + 1;
		let Day = CurrentDate.getDate();
		let Hour = CurrentDate.getHours();
		let Minute = CurrentDate.getMinutes();
		let Second = CurrentDate.getSeconds();

		if (type === 'start') {
			Year = Year - 60;
		} else if (type === 'end') {
			Year = Year + 2;
		}
		Month = Month > 9 ? Month : '0' + Month;;
		Day = Day > 9 ? Day : '0' + Day;
		if (type != '') {
			return `${Year}-${Month}-${Day}`;
		}
		return `${Year}-${Month}-${Day} ${Hour}:${Minute}:${Second}`;
	}
	//计算两个时间的时间差
	function CalDateDiff(StartDate, EndDate) {
		var DateDiff = StartDate.getTime() - EndDate.getTime(); //时间差的毫秒数
		var Leave1 = DateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
		var Hour = Math.floor(Leave1 / (3600 * 1000)) //计算出小时数	
		var Leave2 = Leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
		var Minutes = Math.floor(Leave2 / (60 * 1000)) //计算相差分钟数
		var Leave3 = Leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
		var Seconds = Math.round(Leave3 / 1000) //计算相差秒数
		return Seconds;
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.search {
		position: absolute;
		width: 70%;
		margin-left: 5rpx;
	}

	.addstoragein {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 20upx;
	}

	.querystoragein {
		width: 20%;
		height: 90rpx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 450upx;
		margin-top: -90upx;
	}

	.icmoscrollview {
		width: 100%;
		height: 840upx;
		margin-top: 20upx;
	}

	.auditstoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 300upx;
		margin-top: -96upx;
	}

	.unauditstoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 550upx;
		margin-top: -96upx;
	}

	.deletestoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 20upx;
	}

	.billhead {
		width: 100%;
		margin-top: 50upx;
	}

	.title {
		display: flex;
		margin-left: 50upx;
		font-size: 40upx;
	}

	.billnoempty {	
		display: flex;
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 300upx;
		text-align: center;
		color: #777777;
	}

	.billnofull {		
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 300upx;
		text-align: center;
		color: #000000;
	}

	.detailtitle {	
		display: flex;
		font-size: 35upx;
		margin-top: 30upx;
		margin-left: 30upx;
	}

	.detaildata {	
		display: flex;		
		font-size: 35upx;
		margin-top: -50upx;
		margin-left: 270upx;
		text-align: center;
	}

	.data {
		display: flex;
		width: 300upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 320upx;
		text-align: center;
	}

	.dataline {
		width: 60%;
		height: 5upx;
		background-color: #4CD964;
		margin-left: 250upx;
	}

	.proreportview {
		width: 100%;
		height: 950upx;
	}

	.sumscrollview {
		width: 100%;
		height: 920upx;
		margin-top: 30upx;
	}

	.cartonlabelscrollview {
		width: 100%;
		height: 550upx;
		margin-top: 20upx;
	}

	.selectinfoscrollview {
		width: 100%;
		height: 950upx;
		margin-top: 50upx;
	}

	.unselectinfoscrollview {
		width: 100%;
		height: 670upx;
		margin-top: 50upx;
	}

	.detailscrollview {
		width: 100%;
		height: 950upx;
		margin-top: 20upx;
	}

	.selecttab {
		color: #007AFF;
	}

	.selecttabline {
		background-color: #007AFF;
	}

	.tabbackground {			
		width: 100%;
		height: 90upx;
		margin-top: 150upx;
		background-color: #F4F4F4;
	}

	.tableft {		
		font-size: 45upx;
		margin-top: 30upx;
		margin-left: 40upx;
	}

	.tabmiddle {
		display: flex;
		font-size: 45upx;
		margin-top: -68upx;
		margin-left: 330upx;
	}

	.tabright {	
		display: flex;
		font-size: 45upx;
		margin-top: -68upx;
		margin-left: 630upx;
	}

	.tableftline {		
		width: 18%;
		height: 5upx;		
		margin-left: 40upx;
	}

	.tabmiddleline {	
		width: 18%;
		height: 5upx;		
		margin-left: 330upx;
	}

	.tabrightline {		
		width: 15%;
		height: 5upx;		
		margin-left: 620upx;
	}

	.billstatus {
		margin-top: -90upx;
		margin-left: 570upx;
	}

	.productdetail {		
		margin-top: 50upx;
	}

	.scanned {	
		display: flex;		
		font-size: 40upx;
		margin-left: 30upx;
		margin-top: 20upx;
	}
	
	.queryall {
		display: flex;	
		font-size: 40upx;
		color: #007AFF;
		margin-left: 570upx;
		margin-top: -60upx;
	}

	.modeltitle {		
		font-size: 40upx;
		margin-left: 50upx;
		margin-top: 180upx;
	}

	.modeldata {		
		width: 500upx;
		font-size: 45upx;
		margin-left: 300upx;
		margin-top: 180upx;
	}

	.numbertitle {		
		font-size: 40upx;
		margin-left: 50upx;
		margin-top: 280upx;
	}

	.numberdata {		
		width: 500upx;
		font-size: 45upx;
		margin-left: 300upx;
		margin-top: 280upx;
	}

	.nametitle {		
		font-size: 40upx;
		margin-left: 50upx;
		margin-top: 380upx;
	}

	.namedata {		
		width: 500upx;
		font-size: 45upx;
		margin-left: 300upx;
		margin-top: 380upx;
	}

	.labelcounttitle {		
		font-size: 40upx;
		margin-left: 50upx;
		margin-top: 480upx;
	}

	.labelcountdata {		
		width: 500upx;
		font-size: 45upx;
		margin-left: 300upx;
		margin-top: 480upx;
	}

	.selectlabel {
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 20upx;
	}

	.deletelabel {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-right: 150upx;
		margin-top: -95upx;
	}	
</style>
