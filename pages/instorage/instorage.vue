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
					<uni-list-item v-for="(item,index) in IcmoListData" :key="index" :title="'制单人：'
				   + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '汇报单编号：' + item.FBillNo" clickable
						:ischecked="item.FIsChecked" :isshowcheckbox="true" @CheckBoxChange="ChangeIsChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>



		<view class="proreportview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
			<button class="deletebill" v-on:click="DeleteProreportBill()">删除</button>
			<button class="auditproreport" v-on:click="AuditStorageIn()">审核</button>
			<button class="unauditproreport" v-on:click="UnAuditProReport()">反审</button>

			<view class="billhead" v-show="IsBillHeadVisible">
				<text class="title">单据编号：</text>
				<text class="billnoempty"
					v-bind:class="{billnofull : StorageInBillNo != '空'}">{{StorageInBillNo}}</text>
				<view class="dataline"></view>

				<text class="title">入库日期：</text>
				<picker mode="date" :value="FinishDate" :start="StartDate" :end="EndDate" @change="FinishDateChange">
					<view class="data">{{FinishDate}}</view>
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
			<text class="queryall" clickable v-on:click="GetProReportDetail()">查看全部</text>

			<scroll-view class="detailscrollview" scroll-y="true">
				<text class="detailtitle">物料编码：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FNumber : '空'}}</text>
				<text class="detailtitle">物料名称：</text>
				<text class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FName : '空'}}</text>
				<text class="detailtitle">标签类型：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FBarCodeType : '空'}}</text>
				<text class="detailtitle">订单号：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FSOBillNo : '空'}}</text>
				<text class="detailtitle">计划生产数量：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FAuxQty : '空'}}</text>
				<text class="detailtitle">计划开工日期：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FPlanCommitDate : '空'}}</text>
				<text class="detailtitle">实际完工日期：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? (this.ProreportInfoItem.FFinishDate != null ? this.ProreportInfoItem.FFinishDate : '空') : '空'}}</text>
				<text class="detailtitle">生产预测单号：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? (this.ProreportInfoItem.FPPOrderBillNo != null ? this.ProreportInfoItem.FPPOrderBillNo : '空') : '空'}}</text>
				<text class="detailtitle">班组代码：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FTeamNumber : '空'}}</text>
				<text class="detailtitle">班组名称：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FTeamName : '空'}}</text>
				<text class="detailtitle">车间代码：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FDeptNumber : '空'}}</text>
				<text class="detailtitle">车间名称：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FDeptName : '空'}}</text>
				<text class="detailtitle">计量单位代码：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FUnitNumber : '空'}}</text>
				<text class="detailtitle">计量单位名称：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FUnitName : '空'}}</text>
				<text class="detailtitle">箱数：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FInPackPreQty : '空'}}</text>
				<text class="detailtitle">每箱数量：</text>
				<text
					class="detaildata">{{this.ProreportInfoItem != null ? this.ProreportInfoItem.FOutPackPreQty : '空'}}</text>
			</scroll-view>
		</view>



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
				IsBillHeadVisible: true,
				IsAddStorageIn: true,
				StorageBinIsActive: false,
				StorageArray: [0, '请选择仓库'],
				StorageBinArray: [0, '请选择仓位'],
				FinishDate: DateFormat({
					format: true
				}),
				ItemTouchStartDate: null,
				StartDate: DateFormat('start'),
				EndDate: DateFormat('end'),
				IcmoListData: [],
				StorageInListData: [],
				StatusArray: ['未入库', '已入库'],
				SelectedProreport: '',
				SelectedIcmo: '',
				ProreportInfoItem: null,
				ProreportItem: null,
				MaterialInfo: null,
				TouchStartX: 0,
				ItemTouchStartX: 0,
				LongPressTime: 2,
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
					}

					if (me.TabSelectedIndex == 1) {
						me.ScanBarCode(Barcode);						
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
					}
				});
			},
			//扫描仓库
			ScanWareHouse: function() {
				let me = this;
				if (me.StorageInBillNo == '空') {
					Config.ShowMessage('请新增入库单！');
					Config.PopAudioContext(false);
					return;
				}
				uni.scanCode({
					success: function(result) {
						uni.request({
							url: uni.getStorageSync('OtherUrl'),
							method: 'POST',
							data: {
								ModuleCode: 'getStockByNumber',
								token: uni.getStorageSync('token'),
								ModuleParam: {
									FNumber: result.result
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

								let DataModel = result.data.ResultData.getStockByNumberInfo
									.data0;
								me.StorageArray = [DataModel.FItemID, DataModel.FName];
								// if(me.StorageBinIsActive)
								// {
								// 	console.log(me.StorageBinIsActive);
								// }
								// else
								// {
								//     let DataModel = result.data.ResultData.getStockByNumberInfo.data0;
								//     me.StorageArray = [DataModel.FItemID, DataModel.FName];	
								// }
							},
							fail: () => {
								Config.ShowMessage('请求数据失败！');
								Config.PopAudioContext(false);
							}
						});
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
				if (this.TouchStartX - TouchEndX >= this.SlidingValue && this.TabSelectedIndex == 0) {
					this.SlidingPage(true);
				}
				if (TouchEndX - this.TouchStartX >= this.SlidingValue && this.TabSelectedIndex == 1) {
					this.SlidingPage(false);
				}
			},
			//切换页签
			SwitchTab: function(TabSelectedIndex) {
				if (this.TabSelectedIndex != TabSelectedIndex) {
					this.TabSelectedIndex = TabSelectedIndex;
				}
			},
			//滑动页面
			SlidingPage: function(IsSlidingLeftPage) {
				this.TabSelectedIndex = IsSlidingLeftPage ? 1 : 0;
			},
			//显示汇报单
			ShowPdaIcmoInfo: function() {
				if (this.SelectStatus == '未入库') {
					this.IsAddStorageIn = true;
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
								return;
							}
							this.IcmoListData = result.data.ResultData.getPdaIcmoRptNoPutInListInfo.data0;
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
						}
					});
				} else {
					this.IsAddStorageIn = false;
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
								return;
							}
							this.IcmoListData = result.data.ResultData.getPdaIcmoRptPutInListInfo.data0;
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
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
					}
				});

			},
			//获取选中的汇报单
			GetSelectProreportByQuery: function() {
				this.SelectedProreport = '';
				this.SelectedIcmo = '';
				this.StorageInBillNo = '';
				this.StorageInterId = 0;
				this.FinishDate = '';
				for (var i = 0; i < this.IcmoListData.length; i++) {
					if (this.IcmoListData[i].FIsChecked) {
						this.SelectedProreport += this.IcmoListData[i].FId + ',';
						this.SelectedIcmo += this.IcmoListData[i].FSrcInterId + ',';
						this.StorageInBillNo = this.IcmoListData[i].FBillNoStorageIn;
						this.StorageInterId = this.IcmoListData[i].FId;
						this.FinishDate = this.IcmoListData[i].FDateStorageIn;
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
				this.FinishDate = '';
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
					Config.ShowMessage('请选择需要新增入库的汇报单！');
					Config.PopAudioContext(false);
					return 0;
				}
			},
			//扫描条码
			ScanBarCode: function(Barcode) {
				if (this.StorageInBillNo == '空') {
					Config.ShowMessage('请新增入库单！');
					Config.PopAudioContext(false);
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
							FDate: this.FinishDate,
							FBillerID: uni.getStorageSync('FUserId'),
							FPackBarCode: Barcode,
							FIcmoRptIds: this.SelectedProreport,
							FIcmoRptId: '',
							Result: 0,
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
						if (this.IsAddStorageIn) {
							this.ShowProReportGroupInfoByAdd();
						} else {
							this.ShowProReportGroupInfoByQuery();
						}
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
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
						this.FinishDate = DateFormat({
							format: true,
						});
						this.StorageInListData = [];
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
					}
				});
			},
			//显示生产汇报单分组信息
			ShowProReportGroupInfoByAdd: function() {
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
							return;
						}
						this.StorageInListData = result.data.ResultData.PdaICMORptGroupInfo.data0;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
					}
				});
			},
			//显示生产汇报单分组信息
			ShowProReportGroupInfoByQuery: function() {
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
							return;
						}
						this.StorageInListData = result.data.ResultData.PdaICMORptGroupInfo.data0;
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
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
			//审核入库单
			AuditStorageIn: function() {
				if (this.StorageInBillNo == '空') {
					Config.ShowMessage('请新增或者选择入库单！');
					Config.PopAudioContext(false);
					return;
				}
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'pdaICMORptToICMORpt',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.ProReportInterId,
							FBillNo: this.ProReportBillNo,
							Result: 0,
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
						let DataParam = result.data.ResultData.PdaICMORptToICMORpt.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
					}
				});
			},
			//反审核生产汇报单
			UnAuditProReport: function() {
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'unPdaICMORptToICMORpt',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageInterId,
							Result: 0,
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
						let DataParam = result.data.ResultData.unPdaICMORptToICMORpt.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
					}
				});
			},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//清除单据头数据
			ClearBillHeadData: function(me) {
				me.StorageInterId = 0;
				me.StorageInBillNo = '空';
				me.ProReportSrcInterId = 0;
				me.SelectWorkShopArray = [0, '请选择车间'];
				me.SelectTeamArray = [0, '请选择班组'];
				me.FinishDate = DateFormat({
					format: true
				});
			},
			//删除汇报单
			DeleteProreportBill: function() {
				let me = this;
				if (me.StorageInBillNo == '空') {
					Config.ShowMessage('请新增汇报单！');
					Config.PopAudioContext(false);
					return;
				}
				if (me.SelectWorkShopArray[0] == 0) {
					Config.ShowMessage('请填写车间！');
					Config.PopAudioContext(false);
					return;
				}
				if (me.SelectTeamArray[0] == 0) {
					Config.ShowMe8sage('请填写班组！');
					Config.PopAudioContext(false);
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.StorageInBillNo + '的汇报单？',
					success: function(result) {
						if (result.confirm) {
							uni.request({
								url: uni.getStorageSync('OtherUrl'),
								method: 'POST',
								data: {
									ModuleCode: 'ICMORpt2_9',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FId: me.StorageInterId,
										Result: 0,
										Msg: ''
									}
								},
								success: (resdelete) => {
									let ResultCode = resdelete.data.ResultCode;
									let ResultMsg = resdelete.data.ResultMsg;
									if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
										Config.ShowMessage('账号登录异常，请重新登录！');
										Config.PopAudioContext();
										return;
									}
									let DataParam = resdelete.data.ResultData.ICMORpt2_9
										.dataparam;
									ResultCode = DataParam.Result;
									if (ResultCode == 0) {
										Config.ShowMessage(DataParam.Msg);
										Config.PopAudioContext();
										return;
									}

									Config.ShowMessage(DataParam.Msg);
									me.ClearBillHeadData(me);
									me.GetProReportInfoExpand(null);
								},
								fail: () => {
									Config.ShowMessage('请求数据失败！');
									Config.PopAudioContext();
								}
							});
						}
					}
				});
			},
			//根据汇报单信息获取明细
			GetProReportDetail: function() {
				uni.showLoading({
					title: 'Loading'
				});
				uni.navigateTo({
					url: '/pages/instorage/cartonlabeldetail?ProReportInterId=' + this.ProReportInterId +
						'&ProReportSrcInterId=' + this.ProReportSrcInterId
				});
				uni.hideLoading();
			},
			//根据汇报单信息获取扩展信息
			GetProReportInfoExpand: function(item) {
				if (item != null) {
					this.TabSelectedIndex = 2;
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
			//单据页面选中的Item
			InfoItemSelected: function(item) {
				this.GetProReportInfoExpand(item);
			},
			//选择完工日期
			FinishDateChange(e) {
				this.FinishDate = e.detail.value
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
		height: 90rpx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 150rpx;
		margin-top: 0rpx;
	}

	.querystoragein {
		width: 20%;
		height: 90rpx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 450rpx;
		margin-top: -90rpx;
	}

	.icmoscrollview {
		width: 100%;
		height: 840rpx;
		margin-top: 20rpx;
	}

	.deletebill {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 50rpx;
		margin-top: 20rpx;
	}

	.auditproreport {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 300rpx;
		margin-top: -96rpx;
	}

	.unauditproreport {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 550rpx;
		margin-top: -96rpx;
	}

	.hidebillhead {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 564rpx;
		margin-top: -96rpx;
	}

	.billhead {
		width: 100%;
		margin-top: 50rpx;
	}

	.title {
		display: flex;
		margin-left: 50rpx;
		font-size: 40rpx;
	}

	.billnoempty {
		display: flex;
		width: 200rpx;
		font-size: 40rpx;
		margin-top: -60rpx;
		margin-left: 300rpx;
		text-align: center;
		color: #777777;
	}

	.billnofull {
		display: flex;
		width: 200rpx;
		font-size: 40rpx;
		margin-top: -60rpx;
		margin-left: 300rpx;
		text-align: center;
		color: #000000;
	}

	.detailtitle {
		display: flex;
		font-size: 35rpx;
		margin-top: 30rpx;
		margin-left: 30rpx;
	}

	.detaildata {
		display: flex;
		text-align: center;
		font-size: 35rpx;
		margin-top: -50rpx;
		margin-left: 270rpx;
	}

	.data {
		display: flex;
		width: 300rpx;
		font-size: 40rpx;
		margin-top: -60rpx;
		margin-left: 320rpx;
		text-align: center;
	}

	.dataline {
		width: 60%;
		height: 5rpx;
		background-color: #4CD964;
		margin-left: 250rpx;
	}

	.barcode {
		display: flex;
		width: 50rpx;
		height: 50rpx;
		margin-top: -55rpx;
		margin-left: 650rpx;
	}

	.proreportview {
		width: 100%;
		height: 950rpx;
	}

	.sumscrollview {
		width: 100%;
		height: 920rpx;
		margin-top: 30rpx;
	}

	.cartonlabelscrollview {
		width: 100%;
		height: 550rpx;
		margin-top: 20rpx;
	}

	.selectinfoscrollview {
		width: 100%;
		height: 850rpx;
		margin-top: 50rpx;
	}

	.unselectinfoscrollview {
		width: 100%;
		height: 550rpx;
		margin-top: 50rpx;
	}

	.detailscrollview {
		width: 100%;
		height: 950rpx;
		margin-top: 20rpx;
	}

	.selecttab {
		color: #007AFF;
	}

	.selecttabline {
		background-color: #007AFF;
	}

	.tabbackground {
		position: absolute;
		width: 100%;
		height: 100rpx;
		margin-top: 660rpx;
		background-color: #F4F4F4;
	}

	.tableft {
		position: absolute;
		font-size: 45rpx;
		margin-top: 20rpx;
		margin-left: 40rpx;
	}

	.tabmiddle {
		position: absolute;
		font-size: 45rpx;
		margin-top: 20rpx;
		margin-left: 330rpx;
	}

	.tabright {
		position: absolute;
		font-size: 45rpx;
		margin-top: 20rpx;
		margin-left: 630rpx;
	}

	.tableftline {
		position: absolute;
		width: 18%;
		height: 5rpx;
		margin-top: 80rpx;
		margin-left: 40rpx;
	}

	.tabmiddleline {
		position: absolute;
		width: 18%;
		height: 5rpx;
		margin-top: 80rpx;
		margin-left: 330rpx;
	}

	.tabrightline {
		position: absolute;
		width: 15%;
		height: 5rpx;
		margin-top: 80rpx;
		margin-left: 620rpx;
	}

	.billstatus {
		position: absolute;
		margin-top: -90rpx;
		margin-left: 570rpx;
	}

	.productdetail {
		position: absolute;
		margin-top: 50rpx;
	}

	.scanned {
		display: flex;
		font-size: 40rpx;
		margin-left: 30rpx;
		margin-top: 20rpx;
	}

	.modeltitle {
		position: absolute;
		font-size: 40rpx;
		margin-left: 50rpx;
		margin-top: 180rpx;
	}

	.modeldata {
		position: absolute;
		width: 500rpx;
		font-size: 45rpx;
		margin-left: 300rpx;
		margin-top: 180rpx;
	}

	.numbertitle {
		position: absolute;
		font-size: 40rpx;
		margin-left: 50rpx;
		margin-top: 280rpx;
	}

	.numberdata {
		position: absolute;
		width: 500rpx;
		font-size: 45rpx;
		margin-left: 300rpx;
		margin-top: 280rpx;
	}

	.nametitle {
		position: absolute;
		font-size: 40rpx;
		margin-left: 50rpx;
		margin-top: 380rpx;
	}

	.namedata {
		position: absolute;
		width: 500rpx;
		font-size: 45rpx;
		margin-left: 300rpx;
		margin-top: 380rpx;
	}

	.labelcounttitle {
		position: absolute;
		font-size: 40rpx;
		margin-left: 50rpx;
		margin-top: 480rpx;
	}

	.labelcountdata {
		position: absolute;
		width: 500rpx;
		font-size: 45rpx;
		margin-left: 300rpx;
		margin-top: 480rpx;
	}

	.selectlabel {
		width: 30%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-left: 150rpx;
		margin-top: 20rpx;
	}

	.deletelabel {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50rpx;
		margin-right: 150rpx;
		margin-top: -95rpx;
	}

	.queryall {
		display: flex;
		font-size: 40rpx;
		color: #007AFF;
		margin-left: 570rpx;
		margin-top: -60rpx;
	}
</style>
