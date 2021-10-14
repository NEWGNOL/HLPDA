<template>
	<view class="container">
		<view class="instorageview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus"
				@input="ShowPOInstockInfo('')">
			</billstatus>
			
			<button class="addstoragein" v-bind:disabled="!IsAddStorageIn" v-on:click="AddStorageIn()">新增</button>
			<button class="querystoragein" v-bind:disabled="IsAddStorageIn" v-on:click="QueryStorageIn()">查询</button>
			
			<scroll-view class="poinstockscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in POInstockListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '单据编号：' + item.FBillNo
					+ '\n' + '单据状态：' + item.FStatus" 
					clickable :ischecked="item.FIsChecked" :isshowcheckbox="true"
					@CheckBoxChange="ChangeIsChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>



		<view class="instorageview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>			
			<button class="auditstoragein" v-on:click="AuditStorageIn()">审核</button>
			<button class="unauditstoragein" v-on:click="UnAuditStorageIn()">反审</button>
			<button class="deletestoragein" v-on:click="DeleteStorageIn()">删除</button>

			<view class="billhead" v-show="IsBillHeadVisible">
				<text class="title">单据编号：</text>
				<text class="billnoempty">{{StorageInBillNo}}</text>
				<view class="dataline"></view>

				<text class="title">供应商：</text>
				<view class="data">{{SelectSupplierArray[1]}}</view>
				<view class="dataline"></view>

				<text class="title">入库日期：</text>
				<picker mode="date" :value="InStorageDate" :start="StartDate" :end="EndDate"
					@change="InStorageDateChange">
					<view class="data">{{InStorageDate}}</view>
				</picker>
				<view class="dataline"></view>

				<text class="title">收料仓库：</text>
				<view class="data">{{SelectWareHouseArray[1]}}</view>
				<view class="dataline"></view>
			</view>

			<scroll-view class="selectinfoscrollview" v-bind:class="{unselectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in POInstockGroupData" :key="index" :title="item.FModel
			 		+ '/' + item.FNumber  + '\n' + item.FSumQty + '只/' + (item.FSumQty/item.FInPackPreQty)
					.toFixed(2)+ '件' + '\n' + item.FScannedQty + '只/' + (item.FScannedQty/item.FInPackPreQty)
					.toFixed(2) + '件'" isshowprogress v-bind:percent="Math.round((item.FScannedQty / item.FSumQty) * 100, 0)"
					clickable v-on:click="GetPOInstockInfoExpand(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>



		<view class="instorageview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
			<text class="scanned">已扫描条码：</text>
			<text class="queryall" clickable v-on:click="GetStorageInCartonDetail()">查看全部</text>
			<view class="listline"></view>
			
			<text class="detailtitle">物料编码：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FNumber : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">物料型号：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FModel : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">物料名称：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FItemName : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">收料仓库：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FStockName : '空'}}</text>
			<view class="listline"></view>
			
			<text class="detailtitle">即时库存：</text>
			<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FInventoryQty
			 + this.SelectGroupModel.FUnitName : '空'}}</text>
			<view class="listline"></view>
		</view>



		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">收料单</text>
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
		components: {
			Config
		},
		data() {
			return {
				StorageInterId: 0,
				StorageInBillNo: '空',
				StorageInSrcInterId: 0,
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
					format: true
				}),
				StartDate: Config.DateFormat('start'),
				EndDate: Config.DateFormat('end'),
				POInstockListData: [],
				POInstockGroupData: [],
				IsBillHeadVisible: true,
				IsAddStorageIn: true,
				StorageBinIsActive: true,
				Main: '',
				Receiver: ''
			}
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		onLoad() {
			this.AddListener();
			this.GetGblSetting();
			this.ShowPOInstockInfo('');
		},
		onUnload() {
			this.RemoveListener();
		},
		onShow() {
			if (this.IsAddStorageIn) {
				this.ShowPOInStockGroupInfoByAdd();
			} else {
				this.ShowPOInStockGroupInfoByQuery();
			}
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
						me.ShowPOInstockInfo(Barcode);
					} else if (me.TabSelectedIndex == 1) {
						me.ScanBarCode(Barcode);
					}
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
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
				}
			},
			//滑动页面
			SlidingPage: function(IsSlidingLeftPage) {
				if (IsSlidingLeftPage) {
					this.TabSelectedIndex++;
				} else {
					this.TabSelectedIndex--;
				}

				if (this.TabSelectedIndex == 0) {} else if (this.TabSelectedIndex == 1) {

				} else {}
			},
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//清除单据头数据
			ClearBillHeadData: function(me) {
				me.StorageInterId = 0;
				me.StorageInBillNo = '空';
				me.StorageInSrcInterId = 0;
				me.SelectSupplierArray = [0, '请选择供应商'];
				me.SelectWareHouseArray = [0, '请选择收料仓库'];				
				me.InStorageDate = Config.DateFormat({
					format: true
				});
				me.GroupListData = [];
				me.SelectGroupModel = null;
			},
			//检测单据项是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
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
			//显示收料通知单信息
			ShowPOInstockInfo: function(Barcode) {
				if (this.SelectStatus == '未入库') {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'GetPdaPOInstockNoPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FScanBillNo: Barcode,
								FSearchBillNo: this.SearchValue
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
							this.POInstockListData = result.data.ResultData.GetPdaPOInstockNoPutInList
								.data0;							
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
							uni.hideLoading();
						}
					});
				} 
				else {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaPOInstockPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FBillNo: this.SearchValue
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
							this.POInstockListData = result.data.ResultData.GetPdaPOInstockPutInList.data0;							
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
							uni.hideLoading();
						}
					});
				}
				this.IsAddStorageIn = this.SelectStatus == '未入库' ? true : false;
			},
			//新增入库单
			AddStorageIn: function() {
				let IsSucess = this.GetSelectPOInStockByAdd();
				if (IsSucess == 0) {
					return;
				}
				this.SwitchTab(1);
				this.AddStorageInBillNo();					
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
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							return;
						}
						let DataModel = result.data.ResultData.PdaStorageInRpt.dataparam;
						this.ShowStorageInBillHeadInfo(DataModel);
						this.ShowPOInStockGroupInfoByAdd();						
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
						}
					}
				});
			},
			//查询入库单
			QueryStorageIn: function() {
				let IsSuccess = this.GetSelectPOInStockByQuery();
				if (IsSuccess == 0) {
					return;
				}
				this.SwitchTab(1);
				this.ShowPOInStockGroupInfoByQuery();
			},
			//审核入库单验证
			CheckAuditStorageIn:function(){
				if (this.StorageInBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请新增或者选择入库单！');
					return 0;
				}				
				for (var i = 0; i < this.POInstockGroupData.length; i++) {
					let DataModel = this.POInstockGroupData[i];	
					if(DataModel.FScannedQty < DataModel.FSumQty)
					{						
						Config.PopAudioContext(false);
						Config.ShowMessage('物料编码为' + DataModel.FNumber + '没有完成扫描入库！');
						return 0;
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
						ModuleCode: 'pdaPOInstockRptToStorageInRpt',
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
						let DataParam = result.data.ResultData.PdaPOInstockRptToStorageInRpt.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();							
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);											
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);												
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);						
						}
						uni.hideLoading();
					}
				});
			},
			//反审核入库单
			UnAuditStorageIn: function() {
				if (this.StorageInBillNo == '空') {
					Config.PopAudioContext(false);
					Config.ShowMessage('请选择入库单！');
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
						ModuleCode: 'unPOInstockRptToStorageInRpt',
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
						let DataParam = result.data.ResultData.UnPdaPOInstockRptToStorageInRpt.dataparam;
						let Result = DataParam.Result;
						if (Result == 0) {
							Config.ShowMessage(DataParam.Msg);
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						Config.ShowMessage(DataParam.Msg);
						Config.PopAudioContext(true);						
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);						
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);						
						}
						uni.hideLoading();
					}
				});
			},
			//获取选中的收料通知单
			GetSelectPOInStockByAdd: function() {
				this.SelectedPOInstock = '';
				this.StorageInSrcInterId = 0;
				this.SelectSupplierArray = [0, '请选择供应商'];
				this.SelectWareHouseArray = [0, '请选择收料仓库']
				for (var i = 0; i < this.POInstockListData.length; i++) {
					let DataModel = this.POInstockListData[i];
					if (DataModel.FIsChecked) {
						this.SelectedPOInstockModel = DataModel;
						this.SelectedPOInstock += DataModel.FInterID + ',';
						this.StorageInSrcInterId = DataModel.FInterID;
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
			GetSelectPOInStockByQuery: function() {
				this.SelectedPOInstock = '';
				this.StorageInterId = 0;
				this.StorageInBillNo = '空';
				this.InStorageDate = '';
				this.StorageInSrcInterId = 0;
				this.SelectSupplierArray = [0, '请选择供应商'];
				this.SelectWareHouseArray = [0, '请选择收料仓库']
				for (var i = 0; i < this.POInstockListData.length; i++) {
					let DataModel = this.POInstockListData[i];
					if (DataModel.FIsChecked) {
						this.SelectedPOInstockModel = DataModel;
						this.SelectedPOInstock += DataModel.FInterID + ',';
						this.StorageInterId = DataModel.FStockBillId;
						this.StorageInBillNo = DataModel.FStockBillNo;
						this.InStorageDate = DataModel.FStockBillDate;
						this.StorageInSrcInterId = DataModel.FPOOrderInterId;
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
			ShowStorageInBillHeadInfo: function(DataModel){
				this.StorageInterId = DataModel.FId;
				this.StorageInBillNo = DataModel.FBillNo;
				this.InStorageDate = Config.DateFormat({
					format: true,
				});
				this.StorageInListData = [];
			},
			//显示收料通知单分组信息
			ShowPOInStockGroupInfoByAdd: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaPOInStockGroupInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FIndexIdList: this.SelectedPOInstock
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
						this.POInstockGroupData = result.data.ResultData.PdaPOInStockGroupInfo.data0;	
						this.GetBillSelectItem();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();						
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);							
						}
						uni.hideLoading();
					}
				});
			},
			//显示收料通知单分组信息
			ShowPOInStockGroupInfoByQuery: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaPOInStockGroupInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FIndexIdList: this.SelectedPOInstock
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
						this.POInstockGroupData = result.data.ResultData.PdaPOInStockGroupInfo.data0;
						this.GetBillSelectItem();						
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();						
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.PopAudioContext(false);
							Config.ShowMessage(ResultMsg);							
						}
						uni.hideLoading();
					}
				});
			},
			//根据收料通知单信息获取扩展信息
			GetPOInstockInfoExpand: function(item) {
				if (item != null) {
					this.SelectGroupModel = item;
					this.TabSelectedIndex = 2;
				} else {

				}
			},
			//获取入库单外箱明细信息
			GetStorageInCartonDetail: function() {
				uni.showLoading({
					title: 'Loading'
				});
				uni.navigateTo({
					url: '/pages/purchaseinstorage/cartonlabeldetail?StorageInterId=' + this.StorageInterId +
						'&StorageInSrcInterId=' + this.StorageInSrcInterId
				});
				uni.hideLoading();
			},
			//获取选中单据的物料信息
			GetBillSelectItem: function() {
				this.SelectItems = '';
				for (var i = 0; i < this.POInstockGroupData.length; i++) {
					let DataModel = this.POInstockGroupData[i];
					this.SelectItems += DataModel.FItemID + ',';
				}
				this.SelectItems = this.SelectItems.substr(0, this.SelectItems.length - 1);
			},
			//扫描条码做入库
			ScanBarCode: function(Barcode) {
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
						let ResultData = result.data.ResultData.AddPdaStockBillRpt;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						if (this.IsAddStorageIn) {
							this.ShowPOInStockGroupInfoByAdd();
						} else {
							this.ShowPOInStockGroupInfoByQuery();
						}
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						return;
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
			//删除外购入库单
			DeleteStorageIn: function() {
				if (this.StorageInBillNo == '空') {
					Config.ShowMessage('请选择要删除的入库单！');
					Config.PopAudioContext(false);					
					return;
				}				
				let me = this;
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.StorageInBillNo + '的入库单？',
					success: function(result) {
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
										Msg: ''
									}
						  },
						  success: (resdelete) => {
									let ResultCode = resdelete.data.ResultCode;
									let ResultMsg = resdelete.data.ResultMsg;
									if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
										Config.ShowMessage('账号登录异常，请重新登录！');
									    Config.PopAudioContext(false);											
									    return;
									}
									let DataParam = resdelete.data.ResultData.DelPdaStockBillRptHead
													.dataparam;
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
						    fail: () => {
								    Config.ShowMessage('请求数据失败！');
									Config.PopAudioContext(false);								
							},
							complete: (resultcomp) => {
									let ResultMsg = resultcomp.data.ResultMsg;
									if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
										Config.ShowMessage(ResultMsg);
										Config.PopAudioContext(false);									
									}
							}
							});
					}
					}
					});
			},	
			//选择入库日期
			InStorageDateChange(e) {
				this.InStorageDate = e.detail.value
			},
			//条件搜索采购订单列表
			ValueChanged: function() {
				this.ShowPOInstockInfo('');
			}
		}
	}	
</script>

<style>		
	.poinstockscrollview {
		width: 100%;
		height: 850upx;
		margin-top: 20upx;
	}

	.selectinfoscrollview {
		width: 100%;
		height: 620upx;
		margin-top: 50upx;
	}

	.unselectinfoscrollview {
		width: 100%;
		height: 900upx;
		margin-top: 50upx;
	}

	.addstoragein {
		width: 20%;
		uheight: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 20upx;
	}

	.querystoragein {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 450upx;
		margin-top: -95upx;
	}

	.billhead {
		width: 100%;
		margin-top: 50upx;
	}

	.title {
		margin-left: 50upx;
		font-size: 40upx;
	}

	.billnoempty {
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 100upx;
		text-align: center;
		color: #777777;
	}

	.data {
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

	.auditstoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 20upx;		
	}

	.unauditstoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 300upx;
		margin-top: -96upx;
	}

	.deletestoragein {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 550upx;
		margin-top: -96upx;
	}

	.instorageview {
		width: 100%;
		height: 950upx;
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
		margin-top: 20upx;
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
	
	.listline {
		width: 100%;
		height: 3upx;
		background-color: #000000;	
		margin-top: 20upx;
	}
</style>
