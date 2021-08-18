<template>
	<view class="container">
		<view class="outstorageview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus"
				@input="ShowSEOrderInfo()">
			</billstatus>
			<button class="addstorageout" v-bind:disabled="!IsAddStorageOut" v-on:click="AddStorageOut()">新增</button>
			<button class="querystorageout" v-bind:disabled="IsAddStorageOut" v-on:click="QueryStorageOut()">查询</button>
			<scroll-view class="poorderscrollview" scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in SEOrderListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '编号：' + item.FBillNo
					+ '\n' + '发货单编号：' + item.FSEOutStockBillNo" clickable :ischecked="item.FIsChecked" :isshowcheckbox="true"
					@CheckBoxChange="ChangeIsChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>
		
		
		<view class="outstorageview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>
			<button class="deletestorageout" v-on:click="DeleteStorageOut()">删除</button>
			<button class="auditstorageout" v-on:click="AuditStorageOut()">审核</button>
			<button class="unauditstorageout" v-on:click="UnAuditStorageOut()">反审</button>
			
			<view class="billhead" v-show="IsBillHeadVisible">
			      <text class="title">单据编号：</text>
			      <text class="billnoempty">{{StorageOutBillNo}}</text>
			      <view class="dataline"></view>
			
			      <text class="title">客户：</text>
			      <view class="data">{{SelectCustomerArray[1]}}</view>
			      <view class="dataline"></view>
			
			      <text class="title">入库日期：</text>
			      <picker mode="date" :value="OutStorageDate" :start="StartDate" :end="EndDate"
				  @change="OutStorageDateChange">
				  <view class="data">{{OutStorageDate}}</view>
			      </picker>
			      <view class="dataline"></view>
			</view>
			
			<scroll-view class="selectinfoscrollview" v-bind:class="{unselectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true">
				<uni-list>
					<uni-list-item v-for="(item,index) in SEOrderGroupData" :key="index" :title="item.FNumber 
			 			+ '/' + item.FModel + '\n'  + '仓库：' + item.FStockName 
						+ '\n'  + '应发数量：' + item.FShouldSendQty + '\n'  + '实发数量：' + item.FRealSendQty" 
						isshowprogress v-bind:percent="Math.round((item.FShouldSendQty / item.FRealSendQty) * 100, 0)" clickable
						v-on:click="GetSEOrderInfoExpand(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>
		
		
		<view class="outstorageview" v-show="TabSelectedIndex == 2" @touchstart='TouchStart' @touchend='TouchEnd'>
			<text class="scanned">已扫描条码：</text>
			<text class="queryall" clickable v-on:click="GetStorageOutCartonDetail()">查看全部</text>
			
			<scroll-view class="detailscrollview" scroll-y="true">
				<text class="detailtitle">物料编码：</text>
				<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FNumber : '空'}}</text>
				<text class="detailtitle">物料名称：</text>
				<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FItemName : '空'}}</text>
				<text class="detailtitle">标签类型：</text>
				<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FBarCodeType : '空'}}</text>				
			</scroll-view>
		</view>
		
		
		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">销售单</text>
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
		data(){
			return {
				SearchValue: '',
				SelectStatus: '未出库',
				StatusArray: ['未出库', '已出库'],
				SelectSEOrderModel: null,
				SelectGroupModel: null,
				StorageOutInterId: 0,
				StorageOutBillNo: '空',
				SEOrderSrcInterId: 0,
				SelectSEOrder: '',
				SelectItems: '',
				TabSelectedIndex: 0,
				TouchStartX: 0,
				IsAddStorageOut: true,
				OutStorageDate: DateFormat({
					format: true
				}),
				StartDate: DateFormat('start'),
				EndDate: DateFormat('end'),
				SEOrderListData: [],
				SEOrderGroupData: [],
				IsBillHeadVisible: true,
				SelectCustomerArray: [0, '空'],
				Main: '',
				Receiver: ''
			}
		},
		onShow() {
			this.ShowSEOrderGroupInfo();
		},
		onLoad() {	
			this.AddListener();
			this.ShowSEOrderInfo();
		},
		onUnload() {
			this.RemoveListener();
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		methods:{
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
			//切换表头是否可见
			SwitchBillHeadVisible: function() {
				this.IsBillHeadVisible = !this.IsBillHeadVisible;
			},
			//切换页签
			SwitchTab: function(TabSelectedIndex) {
				if (this.TabSelectedIndex != TabSelectedIndex) {
					this.TabSelectedIndex = TabSelectedIndex;
					if (this.TabSelectedIndex == 0) {
						
					} 
					else if (this.TabSelectedIndex == 1) {			
					} 
					else {						
					}
				}
			},
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
						//me.CheckedPOInstock(Barcode);
					} else if (me.TabSelectedIndex == 1) {
						me.ScanBarCode(Barcode);
					}
				}
			},
			//移除广播监听
			RemoveListener: function() {
				this.Main.unregisterReceiver(this.Receiver); //取消监听
			},
			//扫描条码做出库
			ScanBarCode: function(Barcode) {
				if (this.StorageOutBillNo == '空') {
					Config.ShowMessage('请新增出库单！');
					Config.PopAudioContext(false);					
					return;
				}
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'addPdaStorageOutRpt',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageOutInterId,
							FBillNo: this.StorageOutBillNo,
							FBillerID: uni.getStorageSync('FUserId'),
							FDate: this.OutStorageDate,
							FDeptID: this.SelectSEOrderModel.FDeptID,							
							FManagerID: this.SelectSEOrderModel.FManagerID,
							FEmpID: this.SelectSEOrderModel.FEmpID,
							FCustID: this.SelectSEOrderModel.FCustID,							
							FStorageId: this.SelectSEOrderModel.FStorageId,
							FStorageBinId: this.SelectSEOrderModel.FStorageBinId,
							FSEOrderInterId: this.SelectSEOrderModel.FInterID,
							FPackBarCode: Barcode,
							FICItems: this.SelectItems,
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
						let ResultData = result.data.ResultData.AddPdaStorageOutRpt;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
						Config.PopAudioContext(true);
						this.ShowSEOrderGroupInfo();
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
			//新增销售出库单
			AddStorageOut:function(){
				let IsSuccess= this.GetSelectSEOrderByAdd();
				if(IsSuccess == 0){
					return;
				}
				this.SwitchTab(1);
				this.AddStorageOutBillNo();
				this.ShowSEOrderGroupInfo();				
			},
			//查询销售出库单
			QueryStorageOut:function(){
				let IsSuccess= this.GetSelectSEOrderByQuery();
				if(IsSuccess == 0){
					return;
				}
				this.SwitchTab(1);
				this.ShowSEOrderGroupInfo();
			},
			//新增入库单编号
			AddStorageOutBillNo: function() {
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaStorageOutRptMaxId',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							Result: 0,
							FId: 0,
							FBillNo: '',
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
						let DataModel = result.data.ResultData.GetPdaStorageOutRptMaxId.dataparam;
						this.StorageOutInterId = DataModel.FId;
						this.StorageOutBillNo = DataModel.FBillNo;
						this.OutStorageDate = DateFormat({
							format: true,
						});	
						uni.hideLoading();					
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext(false);
						uni.hideLoading();
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);
							uni.hideLoading();							
						}
					}
				});
			},
			//显示销售订单列表
			ShowSEOrderInfo:function(){
				if (this.SelectStatus == '未出库') {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaSEOrderNoPutInList',
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
							this.SEOrderListData = result.data.ResultData.GetPdaSEOrderNoPutInList
								.data0;
							uni.hideLoading();
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
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
				else {
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaSEOrderPutInList',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FBillNo: this.SearchValue
							}
						},
						success: (result) => {
							console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);
								uni.hideLoading();
								return;
							}
							this.SEOrderListData = result.data.ResultData.GetPdaSEOrderPutInList.data0;
							uni.hideLoading();
						},
						fail: () => {
							Config.ShowMessage('请求数据失败！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						},
						complete: (resultcomp) => {
							let ResultMsg = resultcomp.data.ResultMsg;
							if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
								Config.ShowMessage(ResultMsg);
								Config.PopAudioContext(false);								
								uni.hideLoading();
							}
						}
					});
				}
				this.IsAddStorageOut = this.SelectStatus == '未出库' ? true : false;
			},
			//获取选中的销售订单
			GetSelectSEOrderByAdd: function() {
				this.SelectSEOrder = '';				
				//this.StorageInSrcInterId = 0;
				this.SelectCustomerArray = [0, '空'];				
				for (var i = 0; i < this.SEOrderListData.length; i++) {
					let DataModel = this.SEOrderListData[i];
					if (DataModel.FIsChecked) {	
						this.SelectSEOrderModel = DataModel;
						this.SEOrderSrcInterId = this.SelectSEOrderModel.FInterID;
						if(this.SelectCustomerArray[0] == 0 && this.SelectCustomerArray[1] == '空'){
							this.SelectCustomerArray = [this.SelectSEOrderModel.FCustID, this.SelectSEOrderModel.FCustName];
						}
						else{
							if(this.SelectCustomerArray[0] != this.SelectSEOrderModel.FCustID 
							&& this.SelectCustomerArray[1] != this.SelectSEOrderModel.FCustName){
								Config.ShowMessage('请选择同一个客户出库的销售订单！');
								Config.PopAudioContext(false);					
								return 0;
							}
						}						
						this.SelectSEOrder += SelectSEOrderModel.FInterID + ',';
						//this.StorageInSrcInterId = DataModel.FPOOrderInterId;						
						//this.SelectWareHouseArray = [DataModel.FStorageId, DataModel.FStorageName];						
					}
				}
				if (this.SelectSEOrder != '') {
					this.SelectSEOrder = this.SelectSEOrder.substr(0, this.SelectSEOrder.length - 1);
				} 
				else {
					this.SelectSEOrder = '0';
				}
			
				if (this.SelectSEOrder == '0') {
					Config.ShowMessage('请选择需要新增出库的销售订单！');
					Config.PopAudioContext(false);					
					return 0;
				}
			},
			//获取选中的销售订单
			GetSelectSEOrderByQuery: function() {
				this.SelectSEOrder = '';				
				//this.StorageInSrcInterId = 0;
				this.SelectCustomerArray = [0, '空'];				
				for (var i = 0; i < this.SEOrderListData.length; i++) {
					let DataModel = this.SEOrderListData[i];
					if (DataModel.FIsChecked) {	
						this.SelectSEOrderModel = DataModel;
						this.SEOrderSrcInterId = this.SelectSEOrderModel.FInterID;
						this.StorageOutInterId = this.SelectSEOrderModel.FStorageOutId;
						this.StorageOutBillNo = this.SelectSEOrderModel.FStorageOutBillNo;
						this.OutStorageDate = this.SelectSEOrderModel.FStorageOutDate;
						if(this.SelectCustomerArray[0] == 0 && this.SelectCustomerArray[1] == '空'){
							this.SelectCustomerArray = [this.SelectSEOrderModel.FCustID, this.SelectSEOrderModel.FCustName];
						}
						else{
							if(this.SelectCustomerArray[0] != this.SelectSEOrderModel.FCustID
							 && this.SelectCustomerArray[1] != this.SelectSEOrderModel.FCustName){
								Config.ShowMessage('请选择同一个客户出库的销售订单！');
								Config.PopAudioContext(false);					
								return 0;
							}
						}						
						this.SelectSEOrder += DataModel.FInterID + ',';
						//this.StorageInSrcInterId = DataModel.FPOOrderInterId;						
						//this.SelectWareHouseArray = [DataModel.FStorageId, DataModel.FStorageName];						
					}
				}
				if (this.SelectSEOrder != '') {
					this.SelectSEOrder = this.SelectSEOrder.substr(0, this.SelectSEOrder.length - 1);
				} 
				else {
					this.SelectSEOrder = '0';
				}
			
				if (this.SelectSEOrder == '0') {
					Config.ShowMessage('请选择需要查询出库的销售订单！');
					Config.PopAudioContext(false);					
					return 0;
				}
			},
			//显示销售订单分组信息
			ShowSEOrderGroupInfo: function() {
				if(this.SelectSEOrder != ''){					
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaSEOrderGroupInfo',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FIndexIdList: this.SelectSEOrder
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
						this.SEOrderGroupData = result.data.ResultData.GetPdaSEOrderGroupInfo.data0;
						this.GetSEOrderSelectItem();
						uni.hideLoading();
					},
					fail: () => {
						Config.ShowMessage('请求数据失败！');
						Config.PopAudioContext();
						uni.hideLoading();
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
							uni.hideLoading();
						}
					}
				});
				}
			},
			//获取选中销售订单的物料信息
			GetSEOrderSelectItem:function(){
				this.SelectItems = '';
				for (var i = 0; i < this.SEOrderGroupData.length; i++) {
					let DataModel = this.SEOrderGroupData[i];
					this.SelectItems += DataModel.FItemID + ',';					
				}
				this.SelectItems = this.SelectItems.substr(0, this.SelectItems.length - 1);				
			},
			//获取销售订单的扩展信息
			GetSEOrderInfoExpand:function(item){
				this.SwitchTab(2);
				this.GetSelectGroupModel(item);
			},
			//删除销售出库单
			DeleteStorageOut: function() {
				let me = this;
				if (me.StorageOutBillNo == '空') {
					Config.ShowMessage('请选择要删除的销售出库单！');
					Config.PopAudioContext(false);					
					return;
				}				
				uni.showModal({
					title: '提示',
					content: '是否需要删除单据编号为' + me.StorageOutBillNo + '的销售出库单？',
					success: function(result) {
					if (result.confirm) {
						uni.request({
							url: uni.getStorageSync('OtherUrl'),
							method: 'POST',
							data: {
								    ModuleCode: 'delPdaStorageOutRptHead',
									token: uni.getStorageSync('token'),
									ModuleParam: {
										FId: me.StorageOutInterId,
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
									let DataParam = resdelete.data.ResultData.DelPdaStorageOutRptHead
													.dataparam;
									ResultCode = DataParam.Result;
									if (ResultCode == 0) {
										Config.ShowMessage(DataParam.Msg);
										Config.PopAudioContext(false);										
										return;
									}
									//me.ClearBillHeadData(me);
									me.GetSEOrderInfoExpand(null);
									Config.ShowMessage(DataParam.Msg);
									Config.PopAudioContext(true);									
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
									    uni.hideLoading();											       
								    }
							}
							});
					}
					}
					});
			},
			//反审核销售出库单
			UnAuditStorageOut: function() {
				if (this.StorageOutBillNo == '空') {
					Config.ShowMessage('请选择要反审核的销售出库单！');
					Config.PopAudioContext(false);					
					return 0;
				}
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'unPdaSEOrderRptToStorageOutRpt',
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
						let DataParam = result.data.ResultData.UnPdaSEOrderRptToStorageOutRpt.dataparam;
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
						return;
					},
					complete: (resultcomp) => {
						let ResultMsg = resultcomp.data.ResultMsg;
						if (ResultMsg != 'undefined' && ResultMsg.indexOf('执行成功') == -1) {
							Config.ShowMessage(ResultMsg);
							Config.PopAudioContext(false);							
							uni.hideLoading();
						}
					}
				});
			},
			//审核销售出库单
			AuditStorageOut: function() {
			},
			//获取出库单外箱明细信息
			GetStorageOutCartonDetail:function(){
				uni.showLoading({
					title: 'Loading'
				});
				uni.navigateTo({
					url: '/pages/outstorage/cartonlabeldetail?StorageOutInterId=' + this.StorageOutInterId +
						'&SEOrderSrcInterId=' + this.seorderin
				});
				uni.hideLoading();
			},
			//获取选中的分组信息
			GetSelectGroupModel:function(item){				
				this.SelectGroupModel = item;
			},
			//检测销售订单（发货通知单）是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
			},
			//选择出库日期
			OutStorageDateChange(e) {
				this.OutStorageDate = e.detail.value
			},
			//条件搜索采购销售订单（发货通知单）列表
			ValueChanged: function() {
				this.ShowSEOrderInfo();
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
</script>

<style>
	.outstorageview {
		width: 100%;
		height: 950upx;
	}
	
	.poorderscrollview {
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
	
	.addstorageout {
		width: 20%;
		uheight: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 150upx;
		margin-top: 20upx;
	}
	
	.querystorageout {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 450upx;
		margin-top: -95upx;
	}
	
	.auditstorageout {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 300upx;
		margin-top: -96upx;
	}
	
	.unauditstorageout {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 550upx;
		margin-top: -96upx;
	}
	
	.deletestorageout {
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
	
	.billnoempty {
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 100upx;
		text-align: center;
		color: #777777;
	}
	
	.title {
		margin-left: 50upx;
		font-size: 40upx;
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
	
	.selecttab {
		color: #007AFF;
	}
	
	.selecttabline {
		background-color: #007AFF;
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
	
	.detailscrollview {
		width: 100%;
		height: 950upx;
		margin-top: 20upx;
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
</style>
