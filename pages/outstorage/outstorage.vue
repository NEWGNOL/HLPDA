<template>
	<view class="container">
		<view class="outstorageview" v-show="TabSelectedIndex == 0" @touchstart='TouchStart' @touchend='TouchEnd'>
			<uni-search-bar class="search" cancelButton="none" v-model="SearchValue" @input="ValueChanged">
			</uni-search-bar>
			<billstatus class="billstatus" :candidates="StatusArray" v-model="SelectStatus"
				@input="ShowBillInfo('')">
			</billstatus>
			
			<button class="scanseorder" v-bind:class="{scanseoutstockorder : !IsScanSEOrder}" v-on:click="SwitchScanMode()">
			{{IsScanSEOrder ? '销售订单' : '发货通知'}}</button>
			<button class="addstorageout" v-bind:disabled="!IsAddStorageOut" v-on:click="AddStorageOut()">新增</button>
			<button class="querystorageout" v-bind:disabled="IsAddStorageOut" v-on:click="QueryStorageOut()">查询</button>
			
			<scroll-view class="poorderscrollview" scroll-y="true" v-show="IsScanSEOrder">
				<uni-list>
					<uni-list-item v-for="(item,index) in SEOrderListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '编号：' + item.FBillNo
					+ '\n' + '发货单编号：' + item.FSEOutStockBillNo + '\n' + '购货单位：' + item.FCustName
					+ '\n' + '单据状态：' + item.FStatus" clickable :ischecked="item.FIsChecked" 
					:isshowcheckbox="true" @CheckBoxChange="ChangeIsChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
			
			<scroll-view class="poorderscrollview" scroll-y="true" v-show="!IsScanSEOrder">
				<uni-list>
					<uni-list-item v-for="(item,index) in SEOrderListData" :key="index" :title="'制单人：'
				    + item.FBillerName + '\n'+ '制单日期：' + item.FDate + '\n' + '编号：' + item.FBillNo
					+ '\n' + '购货单位：' + item.FCustName + '\n' + '单据状态：' + item.FStatus" clickable :ischecked="item.FIsChecked" :isshowcheckbox="true"
					@CheckBoxChange="ChangeIsChecked(item)">
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>
		
		
		<view class="outstorageview" v-show="TabSelectedIndex == 1" @touchstart='TouchStart' @touchend='TouchEnd'>			
			<button class="auditstorageout" v-on:click="AuditStorageOut()">审核</button>
			<button class="unauditstorageout" v-on:click="UnAuditStorageOut()">反审</button>
			<button class="deletestorageout" v-on:click="DeleteStorageOut()">删除</button>
			<button class="checkitem" v-on:click="OpenPopupWindow()">校验</button>
			
			      <view class="billhead" v-show="IsBillHeadVisible">
			      <text class="title">单据编号：</text>
			      <text class="billnoempty">{{StorageOutBillNo}}</text>
			      <view class="dataline"></view>
					  
			      <text class="title">出库日期：</text>
			      <picker mode="date" :value="OutStorageDate" :start="StartDate" :end="EndDate"
				  @change="OutStorageDateChange">
				  <view class="data">{{OutStorageDate}}</view>
			      </picker>
			      <view class="dataline"></view>
									
				  <text class="title">源单编号：</text>
				  <view class="data">{{SelectSrcBillNo}}</view>
				  <view class="dataline"></view>				
			</view>
			
			<scroll-view class="selectinfoscrollview" v-bind:class="{unselectinfoscrollview : !IsBillHeadVisible}"
				scroll-y="true">
				<uni-list>
					<fill-qty v-for="(item,index) in SEOrderGroupData" :key="index" :title="item.FNumber 
			 		+ '/' + item.FModel + '\n'  + '批号：' + item.FBatchNo + '\n'  + '仓库：' + item.FStockName 
					+ '\n'  + '应发数量：'+ item.FShouldSendQty + '只/' 
					+ Math.round(item.FShouldSendQty/item.FOutPackPreQty/item.FInPackPreQty,2)
					+ '件' + '\n' + '实发数量：'+ item.FRealSendQty" 
					@ButtonClick="PopupFillQtyWindow()" v-bind:percent="Math.round((item.FRealSendQty 
					/ item.FShouldSendQty) * 100, 0)" isshowprogress clickable v-on:click="GetBillInfoExpand(item)">
					</fill-qty>
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
				<!-- <text class="detailtitle">标签类型：</text>
				<text class="detaildata">{{this.SelectGroupModel != null ? this.SelectGroupModel.FBarCodeType : '空'}}</text> -->				
			</scroll-view>
		</view>
		
		
		<view class="tabbackground">
			<text class="tableft" v-bind:class="{selecttab : TabSelectedIndex == 0}"
				v-on:click="SwitchTab(0)">来源单</text>
			<view class="tableftline" v-bind:class="{selecttabline : TabSelectedIndex == 0}"></view>
			<text class="tabmiddle" v-bind:class="{selecttab : TabSelectedIndex == 1}"
				v-on:click="SwitchTab(1)">出库单</text>
			<view class="tabmiddleline" v-bind:class="{selecttabline : TabSelectedIndex == 1}"></view>
			<text class="tabright" v-bind:class="{selecttab : TabSelectedIndex == 2}"
				v-on:click="SwitchTab(2)">明细</text>
			<view class="tabrightline" v-bind:class="{selecttabline : TabSelectedIndex == 2}"></view>
		</view>
		
		
		<uni-popup ref="fillqty" type="center" :mask-click="false">
			<uni-popup-dialog mode="input" message="成功消息" title="校验物料" placeholder="请输入物料编码" :duration="2000" :before-close="true" @close="ClosePopupWindow" 
			@confirm="ClosePopupWindow"></uni-popup-dialog>
			<!-- <view style="display: flex; height:300upx;width:500upx;background:#FFFFFF;border-radius:50upx">
				<text style="inputsectiontitle">实发数量：</text>
				<input style="inputsection"></input>
			</view> -->
		</uni-popup>
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
				SelectBillModel: null,
				SelectGroupModel: null,
				StorageOutInterId: 0,
				StorageOutBillNo: '空',				
				SelectSrcInterId: '',
				SelectSrcBillNo: '空',
				SelectItems: '',
				TabSelectedIndex: 0,
				TouchStartX: 0,
				IsAddStorageOut: true,
				IsScanSEOrder: true,
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
			this.ShowBillGroupInfo();			
		},
		onLoad() {	
			this.AddListener();
			this.ShowBillInfo('');
		},
		onUnload() {
			this.RemoveListener();
		},
		onNavigationBarButtonTap() {
			this.SwitchBillHeadVisible();
		},
		methods:{
			//切换扫描模式
			SwitchScanMode: function(){
				this.IsScanSEOrder = !this.IsScanSEOrder;
				this.ShowBillInfo('');
			},
			//打开弹窗
			OpenPopupWindow: function(){
				this.$refs.fillqty.open();
			},
			//关闭弹窗
			ClosePopupWindow: function(e){
				//console.log(e);
				this.$refs.fillqty.close();
				if(e == null || e == ''){
				   Config.ShowMessage('请填写要校验的物料编码！');
				   Config.PopAudioContext(false);					
				   return;
				}				
				
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'checkItemBySEOrder',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FId: this.StorageOutInterId,
							FItem: e,
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
						let ResultData = result.data.ResultData.CheckItemBySEOrder;
						let Result = ResultData.dataparam.Result;
						if (Result == 0) {
							Config.ShowMessage(ResultData.dataparam.Msg);
							Config.PopAudioContext(false);
							return;
						}
						Config.ShowMessage(ResultData.dataparam.Msg);
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
						me.ShowBillInfo(Barcode);
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
			    if(this.IsScanSEOrder){
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
				      			FDeptID: this.SelectBillModel.FDeptID,							
				      			FManagerID: this.SelectBillModel.FManagerID,
				      			FEmpID: this.SelectBillModel.FEmpID,
				      			FCustID: this.SelectBillModel.FCustID,						
				      			FSrcInterId: this.SelectBillModel.FInterID,							
				      			FPackBarCode: Barcode,
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
				      		let ResultData = result.data.ResultData.AddPdaStorageOutRpt;
				      		let Result = ResultData.dataparam.Result;
				      		if (Result == 0) {
				      			Config.ShowMessage(ResultData.dataparam.Msg);
				      			Config.PopAudioContext(false);
				      			return;
				      		}
				      		Config.ShowMessage(ResultData.dataparam.Msg);
				      		Config.PopAudioContext(true);	
				      		this.ShowBillGroupInfo();											
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
				}
				else{					 
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
					   			FDeptID: 0,							
					   			FManagerID: 0,
					   			FEmpID: 0,
					   			FCustID: this.SelectBillModel.FCustID,					
					   			FSrcInterId: this.SelectBillModel.FInterID,							
					   			FPackBarCode: Barcode,
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
					   		let ResultData = result.data.ResultData.AddPdaStorageOutRpt;
					   		let Result = ResultData.dataparam.Result;
					   		if (Result == 0) {
					   			Config.ShowMessage(ResultData.dataparam.Msg);
					   			Config.PopAudioContext(false);
					   			return;
					   		}
					   		Config.ShowMessage(ResultData.dataparam.Msg);
					   		Config.PopAudioContext(true);	
					   		this.ShowBillGroupInfo();											
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
				}
			},
			//选中销售订单（发货通知单）
			CheckedSEOrder: function(BarCode){
				// for (var i = 0; i < this.SEOrderListData.length; i++) {
				// 	let DataModel = this.SEOrderListData[i];
				// 	if (DataModel.FBillNo == BarCode || DataModel.FSEOutStockBillNo == BarCode) {
				// 		DataModel.FIsChecked = true;
				// 		return;
				// 	}
				// }
			},
			//新增销售出库单
			AddStorageOut:function(){
				let IsSuccess= this.GetSelectBillByAdd();
				if(IsSuccess == 0){
					return;
				}
				this.SwitchTab(1);
				this.AddStorageOutBillNo();
				this.ShowBillGroupInfo();							
			},
			//查询销售出库单
			QueryStorageOut:function(){
				let IsSuccess= this.GetSelectBillByQuery();
				if(IsSuccess == 0){
					return;
				}
				this.SwitchTab(1);
				this.ShowBillGroupInfo();				
			},
			//新增入库单编号
			AddStorageOutBillNo: function() {				
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
							return;
						}
						let DataModel = result.data.ResultData.GetPdaStorageOutRptMaxId.dataparam;
						this.StorageOutInterId = DataModel.FId;
						this.StorageOutBillNo = DataModel.FBillNo;
						this.OutStorageDate = DateFormat({
							format: true,
						});											
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
			//根据状态显示对应单据列表
			ShowSEOrderInfoByNoPutIn:function(BarCode){
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
							FBillNoList: BarCode,
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
			},
			//根据状态显示对应单据列表
			ShowSEOrderInfoByPutIn:function(BarCode){
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
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);
							uni.hideLoading();
							return;
						}
						this.SEOrderListData = result.data.ResultData.GetPdaSEOrderPutInList.data0;						
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
			//根据状态显示对应单据列表
			ShowSEOutStockInfoByNoPutIn:function(BarCode){
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaSEOutStockNoPutInList',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FBillNoList: BarCode,
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
						this.SEOrderListData = result.data.ResultData.GetPdaSEOutStockNoPutInList
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
			},
			//根据状态显示对应单据列表
			ShowSEOutStockInfoByPutIn:function(BarCode){
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaSEOutStockPutInList',
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
						this.SEOrderListData = result.data.ResultData.GetPdaSEOutStockPutInList.data0;						
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
			//显示对应单据列表
			ShowBillInfo:function(BarCode){
				if (this.SelectStatus == '未出库') {
					if(this.IsScanSEOrder){
					   this.ShowSEOrderInfoByNoPutIn(BarCode);
					}
					else{
						this.ShowSEOutStockInfoByNoPutIn(BarCode);
					}
				} 
				else {
					if(this.IsScanSEOrder){
						this.ShowSEOrderInfoByPutIn(BarCode);
					}
					else{
						this.ShowSEOutStockInfoByPutIn(BarCode);
					}
				}				
				this.IsAddStorageOut = this.SelectStatus == '未出库' ? true : false;
			},
			//获取选中的单据
			GetSelectBillByAdd: function() {
				this.SelectSrcInterId = '';				
				this.SelectSrcBillNo = '';
				this.SelectCustomerArray = [0, '空'];				
				for (var i = 0; i < this.SEOrderListData.length; i++) {
					let DataModel = this.SEOrderListData[i];
					if (DataModel.FIsChecked) {	
						this.SelectBillModel = DataModel;						
						if(this.SelectCustomerArray[0] == 0 && this.SelectCustomerArray[1] == '空'){
							this.SelectCustomerArray = [this.SelectBillModel.FCustID, this.SelectBillModel.FCustName];
						}
						else{
							if(this.SelectCustomerArray[0] != this.SelectBillModel.FCustID 
							&& this.SelectCustomerArray[1] != this.SelectBillModel.FCustName){
								Config.ShowMessage('请选择同一个客户出库的销售订单！');
								Config.PopAudioContext(false);					
								return 0;
							}
						}						
						this.SelectSrcInterId += this.SelectBillModel.FInterID + ',';
						this.SelectSrcBillNo = this.SelectBillModel.FBillNo + ' ';												
					}
				}
				if (this.SelectSrcInterId != '') {
					this.SelectSrcInterId = this.SelectSrcInterId.substr(0, this.SelectSrcInterId.length - 1);
				} 
				else {
					this.SelectSrcInterId = '0';
				}
			
				if (this.SelectSrcInterId == '0') {
					Config.ShowMessage('请选择需要新增出库的单据！');
					Config.PopAudioContext(false);					
					return 0;
				}
			},
			//获取选中的单据
			GetSelectBillByQuery: function() {
				this.SelectSrcInterId = '';				
				this.SelectSrcBillNo = '';
				this.SelectCustomerArray = [0, '空'];				
				for (var i = 0; i < this.SEOrderListData.length; i++) {
					let DataModel = this.SEOrderListData[i];
					if (DataModel.FIsChecked) {	
						this.SelectBillModel = DataModel;					
						this.StorageOutInterId = this.SelectBillModel.FStorageOutId;
						this.StorageOutBillNo = this.SelectBillModel.FStorageOutBillNo;
						this.OutStorageDate = this.SelectBillModel.FStorageOutDate;
						if(this.SelectCustomerArray[0] == 0 && this.SelectCustomerArray[1] == '空'){
							this.SelectCustomerArray = [this.SelectBillModel.FCustID, this.SelectBillModel.FCustName];
						}
						else{
							if(this.SelectCustomerArray[0] != this.SelectBillModel.FCustID
							 && this.SelectCustomerArray[1] != this.SelectBillModel.FCustName){
								Config.ShowMessage('请选择同一个客户出库的销售订单！');
								Config.PopAudioContext(false);					
								return 0;
							}
						}						
						this.SelectSrcInterId += this.SelectBillModel.FInterID + ',';
						this.SelectSrcBillNo = this.SelectBillModel.FBillNo + ' ';						
					}
				}
				if (this.SelectSrcInterId != '') {
					this.SelectSrcInterId = this.SelectSrcInterId.substr(0, this.SelectSrcInterId.length - 1);
				} 
				else {
					this.SelectSrcInterId = '0';
				}
			
				if (this.SelectSrcInterId == '0') {
					Config.ShowMessage('请选择需要查询出库的单据！');
					Config.PopAudioContext(false);					
					return 0;
				}
			},
			//显示单据分组信息
			ShowBillGroupInfo: function() {
			if(this.SelectSrcInterId != ''){	
				if(this.IsScanSEOrder){					
				uni.showLoading({
					title: 'Loading',
					mask: true
				});
				uni.request({
					url: uni.getStorageSync('OtherUrl'),
					method: 'POST',
					data: {
						ModuleCode: 'getPdaSEOrderGroupInfoByItemId',
						token: uni.getStorageSync('token'),
						ModuleParam: {
							FIndexIdList: this.SelectSrcInterId
						}
					},
					success: (result) => {
						//console.log(result.data);
						let ResultCode = result.data.ResultCode;
						let ResultMsg = result.data.ResultMsg;
						if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
							Config.ShowMessage('账号登录异常，请重新登录！');
							Config.PopAudioContext(false);							
						}						
						this.SEOrderGroupData = result.data.ResultData.GetPdaSEOrderGroupInfoByItemId.data0;	
						this.GetBillSelectItem();											
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
				}
				else{
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'getPdaSEOutStockGroupInfo',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FIndexIdList: this.SelectSrcInterId
							}
						},
						success: (result) => {
							//console.log(result.data);
							let ResultCode = result.data.ResultCode;
							let ResultMsg = result.data.ResultMsg;
							if (ResultCode == 'FAIL' && ResultMsg == '不存在的Token') {
								Config.ShowMessage('账号登录异常，请重新登录！');
								Config.PopAudioContext(false);							
							}						
							this.SEOrderGroupData = result.data.ResultData.GetPdaSEOutStockGroupInfo.data0;	
							this.GetBillSelectItem();											
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
				}
			}
			},
			//获取选中单据的物料信息
			GetBillSelectItem:function(){
				this.SelectItems = '';
				for (var i = 0; i < this.SEOrderGroupData.length; i++) {
					let DataModel = this.SEOrderGroupData[i];
					this.SelectItems += DataModel.FItemID + ',';					
				}
				this.SelectItems = this.SelectItems.substr(0, this.SelectItems.length - 1);					
			},
			//获取单据的扩展信息
			GetBillInfoExpand:function(item){
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
						if(me.IsScanSEOrder){
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
						   			me.GetBillInfoExpand(null);
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
						else{
							
						}
					}
					}
					});
			},
			//反审核销售出库单
			UnAuditStorageOut: function() {				
				if (this.StorageOutBillNo == '空') {
					Config.ShowMessage('请选择要反审核的销售出库单！');
					Config.PopAudioContext(false);					
					return;
				}				
				if(this.IsScanSEOrder){
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
				   			FId: this.StorageOutInterId,
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
				   		}
						else{
				   		    Config.ShowMessage(DataParam.Msg);
				   		    Config.PopAudioContext(true);
						}
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
				}
				else{
					uni.showLoading({
					   	title: 'Loading',
					   	mask: true
					});
					uni.request({
					   	url: uni.getStorageSync('OtherUrl'),
					   	method: 'POST',
					   	data: {
					   		ModuleCode: 'unPdaSEOutStockRptToStorageOut',
					   		token: uni.getStorageSync('token'),
					   		ModuleParam: {
					   			FId: this.StorageOutInterId,
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
					   		let DataParam = result.data.ResultData.UnPdaSEOutStockRptToStorageOutRpt.dataparam;
					   		let Result = DataParam.Result;
					   		if (Result == 0) {
					   			Config.ShowMessage(DataParam.Msg);
					   			Config.PopAudioContext(false);					   			
					   		}
							else{
								Config.ShowMessage(DataParam.Msg);
								Config.PopAudioContext(true);
							}					   		    					   		
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
				}
			},
			//校验审核销售出库单
			CheckAuditStorageOut:function(){
				if (this.StorageOutBillNo == '空') {
					Config.ShowMessage('请选择要审核的销售出库单！');
					Config.PopAudioContext(false);					
					return 0;
				}				
				// for (var i = 0; i < this.SEOrderGroupData.length; i++) {
				// 	let DataModel = this.SEOrderGroupData[i];	
				// 	if(DataModel.FRealSendQty == 0)
				// 	{
				// 		Config.ShowMessage('型号为 ' + DataModel.FNumber + '/' + DataModel.FModel + '实发数量为0，请重新扫描！');
				// 		Config.PopAudioContext(false);						
				// 		return 0;
				// 	}
				// 	if(DataModel.FRealSendQty > DataModel.FShouldSendQty){
				// 		Config.ShowMessage('型号为 ' + DataModel.FNumber + '/' + DataModel.FModel + '实发数量大于应发数量，请重新扫描！');
				// 		Config.PopAudioContext(false);						
				// 		return 0;
				// 	}					
				// }	
			},
			//审核销售出库单
			AuditStorageOut: function() {
				let IsSuccess = this.CheckAuditStorageOut();
				if(IsSuccess == 0){
					return;
				}
				
				if(this.IsScanSEOrder){
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'pdaSEOrderRptToStorageOutRpt',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FIndexIdList: this.SelectSrcInterId,
								FId: this.StorageOutInterId,
								FDate: this.OutStorageDate,
								FBillerID: uni.getStorageSync('FUserId'),
								FBillNo: this.StorageOutBillNo,
								FDeptID: this.SelectBillModel.FDeptID,
								FManagerID: this.SelectBillModel.FManagerID,
								FEmpID: this.SelectBillModel.FEmpID,
								FCustID: this.SelectBillModel.FCustID,
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
							let DataParam = result.data.ResultData.PdaSEOrderRptToStorageOutRpt.dataparam;
							let Result = DataParam.Result;
							if (Result == 0) {
								Config.ShowMessage(DataParam.Msg);
								Config.PopAudioContext(false);								
							}
							else{
								Config.ShowMessage(DataParam.Msg);
								Config.PopAudioContext(true);	
							}							    											
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
				}
				else{
					uni.showLoading({
						title: 'Loading',
						mask: true
					});
					uni.request({
						url: uni.getStorageSync('OtherUrl'),
						method: 'POST',
						data: {
							ModuleCode: 'pdaSEOutStockRptToStorageOut',
							token: uni.getStorageSync('token'),
							ModuleParam: {
								FIndexIdList: this.SelectSrcInterId,
								FId: this.StorageOutInterId,
								FDate: this.OutStorageDate,
								FBillerID: uni.getStorageSync('FUserId'),
								FBillNo: this.StorageOutBillNo,
								FDeptID: 0,
								FManagerID: 0,
								FEmpID: 0,
								FCustID: this.SelectBillModel.FCustID,
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
							let DataParam = result.data.ResultData.PdaSEOutStockRptToStorageOut.dataparam;
							let Result = DataParam.Result;
							if (Result == 0) {
								Config.ShowMessage(DataParam.Msg);
								Config.PopAudioContext(false);								
							}
							else{
								Config.ShowMessage(DataParam.Msg);
								Config.PopAudioContext(true);	
							}							    											
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
				}
			},
			//获取出库单外箱明细信息
			GetStorageOutCartonDetail:function(){				
				uni.showLoading({
					title: 'Loading'
				});
				uni.navigateTo({
					url: '/pages/outstorage/cartonlabeldetail?StorageOutInterId=' + this.StorageOutInterId +
					'&ItemId=' + this.SelectGroupModel.FItemID
				});
				uni.hideLoading();
			},
			//获取选中的分组信息
			GetSelectGroupModel:function(item){				
				this.SelectGroupModel = item;
			},
			//弹出填写数量窗口
			PopupFillQtyWindow:function(){
				//console.log('PopupFillQtyWindow');
				this.$refs.fillqty.open();
			},
			//检测销售订单（发货通知单）是否选中
			ChangeIsChecked: function(item) {
				item.FIsChecked = !item.FIsChecked;
			},
			//选择出库日期
			OutStorageDateChange(e) {
				this.OutStorageDate = e.detail.value
			},
			//条件搜索销售订单（发货通知单）列表
			ValueChanged: function() {
				this.ShowBillInfo('');
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
		height: 670upx;
		margin-top: 50upx;
	}
	
	.unselectinfoscrollview {
		width: 100%;
		height: 750upx;
		margin-top: 50upx;
	}
	
	.scanseorder {
		width: 31%;
		color: #FFFFFF;
		background-color: #F0AD4E;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 30upx;
	}
	
	.scanseoutstockorder {
		width: 31%;
		color: #FFFFFF;
		background-color: #1AAD19;;
		border-radius: 50upx;
		margin-left: 50upx;
		margin-top: 30upx;
	}
	
	.addstorageout {
		width: 20%;
		uheight: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 350upx;
		margin-top: -96upx;
	}
	
	.querystorageout {
		width: 20%;
		height: 90upx;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 550upx;
		margin-top: -96upx;
	}
	
	.auditstorageout {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 10upx;
		margin-top: 30upx;
	}
	
	.unauditstorageout {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 210upx;
		margin-top: -96upx;
	}
	
	.deletestorageout {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 400upx;
		margin-top: -96upx;
	}
	
	.checkitem {
		width: 20%;
		color: #FFFFFF;
		background-color: #007AFF;
		border-radius: 50upx;
		margin-left: 590upx;
		margin-top: -96upx;
	}
	
	.billhead {
		width: 100%;
		margin-top: 50upx;
	}
	
	.billnoempty {
		width: 200upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 50upx;
		text-align: center;
		color: #777777;
	}
	
	.title {
		margin-left: 50upx;
		font-size: 40upx;
	}
	
	.data {
		width: 450upx;
		font-size: 40upx;
		margin-top: -60upx;
		margin-left: 250upx;
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
	
	.inputsectiontitle{
		font-size: 16px;
		color: #000000;	
		margin-top: 20upx;
	}
	
	.inputsection{		
		font-size: 16px;
		color: #000000;
		border: 5upx solid;
		border-color: #888888;
		margin-left: 170upx;
		margin-top: -55upx;
	}
</style>
